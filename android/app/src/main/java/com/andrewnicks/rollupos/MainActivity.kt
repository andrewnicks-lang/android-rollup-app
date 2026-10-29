package com.andrewnicks.rollupos

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.ClipData
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Color
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbDeviceConnection
import android.hardware.usb.UsbManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.hoho.android.usbserial.driver.FtdiSerialDriver
import com.hoho.android.usbserial.driver.UsbSerialPort
import com.hoho.android.usbserial.driver.UsbSerialProber
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URI
import java.nio.charset.StandardCharsets

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var pendingChooserIntent: Intent? = null
    private var pendingCameraCaptureFile: File? = null
    private var pendingCameraCaptureUri: Uri? = null
    private var pendingWebPermRequest: PermissionRequest? = null
    private var pendingGeoOrigin: String? = null
    private var pendingGeoCallback: GeolocationPermissions.Callback? = null

    // USB-C OTG Serial state (OBDLink EX / Vgate vLinker FS) — strictly gated by compiled UDS read-only allowlist
    private val usbLock = Any()
    private var usbConnection: UsbDeviceConnection? = null
    private var usbPort: UsbSerialPort? = null
    private var lastHeaderAddress: String? = null
    private var activeExtendedAddress: String? = null
    private var usbReceiverRegistered = false

    companion object {
        private const val HUB_URL = "https://andrewnicks-lang.github.io/android-rollup-app/"
        private const val ACTION_USB_PERMISSION = "com.andrewnicks.rollupos.USB_PERMISSION"

        private val AT_ALLOWLIST_REGEX = Regex(
            "^(AT(Z|E[01]|L[01]|S[01]|H[01]|CAF[01]|SP[0-9A-C]|ST[0-9A-F]{1,2}|SH[0-9A-F]{3}|CRA[0-9A-F]{3}|CRA|" +
                "FCSH[0-9A-F]{3}|FCSD[0-9A-F]+|FCSM[0-2]|DP|I|AR|AT[0-2]|RV)|STI|STDI|" +
                "STP\\s?(33|53|RS)|STPBR\\s?(125000|500000))$",
            RegexOption.IGNORE_CASE
        )
        private val HEX_PAYLOAD_REGEX = Regex("^[0-9A-F]{2,16}$")

        /**
         * Compiled Kotlin byte-level UDS & AT/ST allowlist gate.
         * Physically blocks 0x2E WriteDataByIdentifier, 0x27 SecurityAccess, 0x10 02 ProgrammingSession,
         * 0x31 RoutineControl, 0x11 ECUReset, 0x14 ClearDTC, 0x34..0x37 Download/Transfer, STPX, and ATPP
         * BEFORE UsbSerialPort.write() can ever be invoked.
         */
        fun validateUsbCommand(rawCmd: String, parkedConfirmed: Boolean): String {
            if (rawCmd.isEmpty() || rawCmd.length > 40) {
                throw SecurityException("Rejected USB command: invalid length (${rawCmd.length})")
            }
            if (rawCmd.any { it == '\r' || it == '\n' || it.code < 32 || it.code > 126 }) {
                throw SecurityException("Rejected USB command: control/newline injection blocked")
            }
            val trimmed = rawCmd.trim().uppercase()
            if (AT_ALLOWLIST_REGEX.matches(trimmed)) {
                return trimmed
            }
            val hex = trimmed.replace(" ", "")
            if (!HEX_PAYLOAD_REGEX.matches(hex) || hex.length % 2 != 0) {
                throw SecurityException("Blocked non-allowlisted adapter command: $trimmed")
            }
            val sid = hex.substring(0, 2).toInt(16)
            return when (sid) {
                0x22 -> {
                    if (hex.length != 6) {
                        throw SecurityException("UDS 0x22 ReadDataByIdentifier must request exactly one 2-byte DID")
                    }
                    hex
                }
                0x3E -> {
                    if (hex != "3E00" && hex != "3E80") {
                        throw SecurityException("UDS 0x3E TesterPresent only permits 3E00 or 3E80")
                    }
                    hex
                }
                0x19 -> {
                    val sub = if (hex.length >= 4) hex.substring(2, 4) else ""
                    if (sub != "02" && sub != "0A") {
                        throw SecurityException("UDS 0x19 ReadDTCInformation only permits sub-functions 0x02 and 0x0A")
                    }
                    hex
                }
                0x10 -> {
                    when (hex) {
                        "1001" -> "1001"
                        "1003" -> {
                            if (!parkedConfirmed) {
                                throw SecurityException("UDS 0x10 03 ExtendedSession requires parkedConfirmed=true")
                            }
                            "1003"
                        }
                        else -> throw SecurityException("Forbidden UDS 0x10 DiagnosticSessionControl sub-function: $hex")
                    }
                }
                else -> throw SecurityException(
                    String.format("Forbidden UDS service 0x%02X blocked by compiled RollupOS read-only gate", sid)
                )
            }
        }

        private val PENDING_78_LINE_REGEX = Regex(
            "(?:^|[\\r\\n])\\s*7F\\s*[0-9A-F]{2}\\s*78\\s*(?=[\\r\\n])",
            RegexOption.IGNORE_CASE
        )
        const val P2_STAR_EXTEND_MS = 5500L
        const val P2_STAR_MAX_TOTAL_MS = 15000L

        fun countPending78Frames(bufferText: String): Int =
            PENDING_78_LINE_REGEX.findAll(bufferText).count()

        fun extendDeadlineForPending78(
            bufferText: String,
            seenPendingCount: Int,
            nowMs: Long,
            currentDeadlineMs: Long,
            maxDeadlineMs: Long
        ): Pair<Int, Long> {
            val cnt = countPending78Frames(bufferText)
            return if (cnt > seenPendingCount) {
                Pair(cnt, minOf(maxDeadlineMs, maxOf(currentDeadlineMs, nowMs + P2_STAR_EXTEND_MS)))
            } else {
                Pair(seenPendingCount, currentDeadlineMs)
            }
        }

        fun isAllowedLanHost(host: String): Boolean {
            val clean = host.trim().lowercase()
            if (clean == "localhost") return true
            val parts = clean.split(".")
            if (parts.size != 4) return false
            val octets = parts.map { it.toIntOrNull() ?: return false }
            if (octets.any { it !in 0..255 }) return false
            val (a, b, _, _) = octets
            return (a == 127) ||
                (a == 10) ||
                (a == 192 && b == 168) ||
                (a == 172 && b in 16..31) ||
                (a == 100 && b in 64..127)
        }

        fun isAllowedLanSyncPath(path: String): Boolean {
            val clean = path.trim()
            if (clean.isEmpty() || clean.contains("..")) return false
            return clean in setOf("/sync/status", "/sync/pull", "/sync/push", "/api/ping") ||
                clean == "/api/wifi-drop/ping" ||
                clean == "/api/wifi-drop/jobs" ||
                clean == "/api/wifi-drop/upload" ||
                clean.startsWith("/api/wifi-drop/jobs/")
        }
    }

    private val usbReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val action = intent?.action ?: return
            if (action == ACTION_USB_PERMISSION) {
                val mgr = getSystemService(Context.USB_SERVICE) as? UsbManager
                val dev: UsbDevice? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    intent.getParcelableExtra(UsbManager.EXTRA_DEVICE, UsbDevice::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    intent.getParcelableExtra(UsbManager.EXTRA_DEVICE)
                }
                val granted = dev != null && mgr?.hasPermission(dev) == true
                val devId = dev?.deviceId ?: -1
                runOnUiThread {
                    if (::webView.isInitialized) {
                        webView.evaluateJavascript(
                            "if(window.__onRollupUsbPermission){window.__onRollupUsbPermission($granted,$devId);}",
                            null
                        )
                    }
                }
            } else if (action == UsbManager.ACTION_USB_DEVICE_DETACHED) {
                closeUsbPortSafely(restoreSession = false)
                runOnUiThread {
                    if (::webView.isInitialized) {
                        webView.evaluateJavascript(
                            "if(window.__onRollupUsbDetached){window.__onRollupUsbDetached();}",
                            null
                        )
                    }
                }
            }
        }
    }

    private fun writeRawLineLocked(port: UsbSerialPort, cmd: String, waitMs: Int): List<String> {
        // Drain stale input bytes first
        val drainBuf = ByteArray(512)
        try {
            while (port.read(drainBuf, 5) > 0) { /* flush stale bytes */ }
        } catch (_: Exception) {}

        val payload = (cmd + "\r").toByteArray(StandardCharsets.US_ASCII)
        port.write(payload, 500)

        val sb = StringBuilder()
        val readBuf = ByteArray(512)
        val startMs = System.currentTimeMillis()
        val baseWaitMs = waitMs.coerceIn(50, 8000).toLong()
        var deadline = startMs + baseWaitMs
        val maxDeadline = startMs + maxOf(baseWaitMs, P2_STAR_MAX_TOTAL_MS)
        var seenPending78 = 0
        while (System.currentTimeMillis() < deadline) {
            val n = port.read(readBuf, 40)
            if (n > 0) {
                sb.append(String(readBuf, 0, n, StandardCharsets.US_ASCII))
                if (sb.indexOf(">") >= 0) {
                    break
                }
                val updated = extendDeadlineForPending78(
                    sb.toString(),
                    seenPending78,
                    System.currentTimeMillis(),
                    deadline,
                    maxDeadline
                )
                seenPending78 = updated.first
                deadline = updated.second
            }
        }
        return sb.toString()
            .substringBefore(">")
            .split('\r', '\n')
            .map { it.trim() }
            .filter { it.isNotEmpty() }
    }

    private fun closeUsbPortSafely(restoreSession: Boolean = true) {
        synchronized(usbLock) {
            val port = usbPort
            val extAddr = activeExtendedAddress
            if (restoreSession && port != null && extAddr != null) {
                try {
                    writeRawLineLocked(port, "ATSH$extAddr", 150)
                    writeRawLineLocked(port, "1001", 150)
                } catch (_: Exception) {}
            }
            activeExtendedAddress = null
            lastHeaderAddress = null
            try { port?.close() } catch (_: Exception) {}
            try { usbConnection?.close() } catch (_: Exception) {}
            usbPort = null
            usbConnection = null
        }
        runOnUiThread {
            try {
                window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            } catch (_: Exception) {}
        }
    }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val callback = filePathCallback
        filePathCallback = null
        val camFile = pendingCameraCaptureFile
        val camUri = pendingCameraCaptureUri
        pendingCameraCaptureFile = null
        pendingCameraCaptureUri = null
        if (callback == null) return@registerForActivityResult

        if (result.resultCode == Activity.RESULT_OK) {
            val dataUri = result.data?.data
            val clipData = result.data?.clipData
            val hasCameraFile = camFile != null && camFile.exists() && camFile.length() > 0L && camUri != null
            if (hasCameraFile && camFile != null) {
                try {
                    writeBytesToMediaOrDownloads(camFile.name, "image/jpeg", camFile.readBytes())
                } catch (_: Exception) {}
            } else if (camFile != null && camFile.exists() && camFile.length() == 0L) {
                try { camFile.delete() } catch (_: Exception) {}
            }
            val uris: Array<Uri>? = when {
                dataUri != null -> arrayOf(dataUri)
                clipData != null && clipData.itemCount > 0 -> {
                    Array(clipData.itemCount) { idx -> clipData.getItemAt(idx).uri }
                }
                hasCameraFile && camUri != null -> arrayOf(camUri)
                else -> null
            }
            callback.onReceiveValue(uris)
        } else {
            if (camFile != null && camFile.exists() && camFile.length() == 0L) {
                try { camFile.delete() } catch (_: Exception) {}
            }
            callback.onReceiveValue(null)
        }
    }

    // Sequential Camera Permission -> File Chooser Launcher (falls back to gallery picker if CAMERA denied)
    private val cameraPermLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        val intent = pendingChooserIntent
        pendingChooserIntent = null
        val launchIntent = if (granted && intent != null) {
            intent
        } else {
            pendingCameraCaptureFile?.let { f ->
                if (f.exists() && f.length() == 0L) {
                    try { f.delete() } catch (_: Exception) {}
                }
            }
            pendingCameraCaptureFile = null
            pendingCameraCaptureUri = null
            Intent(Intent.ACTION_GET_CONTENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "image/*"
            }
        }
        try {
            fileChooserLauncher.launch(launchIntent)
        } catch (_: Exception) {
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    // WebRTC / getUserMedia Audio + Video Runtime OS Permission Bridge
    private val webMediaPermLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grants ->
        val req = pendingWebPermRequest
        pendingWebPermRequest = null
        if (req == null) return@registerForActivityResult

        val allowed = mutableListOf<String>()
        for (res in req.resources) {
            when (res) {
                PermissionRequest.RESOURCE_AUDIO_CAPTURE -> {
                    if (grants[Manifest.permission.RECORD_AUDIO] == true ||
                        hasPerm(Manifest.permission.RECORD_AUDIO)
                    ) {
                        allowed.add(res)
                    }
                }
                PermissionRequest.RESOURCE_VIDEO_CAPTURE -> {
                    if (grants[Manifest.permission.CAMERA] == true ||
                        hasPerm(Manifest.permission.CAMERA)
                    ) {
                        allowed.add(res)
                    }
                }
                else -> allowed.add(res)
            }
        }
        if (allowed.isNotEmpty()) {
            req.grant(allowed.toTypedArray())
        } else {
            req.deny()
        }
    }

    // HTML5 Geolocation (GNSS) Runtime OS Permission Bridge
    private val locationPermLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grants ->
        val origin = pendingGeoOrigin
        val cb = pendingGeoCallback
        pendingGeoOrigin = null
        pendingGeoCallback = null
        if (origin != null && cb != null) {
            val granted = (grants[Manifest.permission.ACCESS_FINE_LOCATION] == true) ||
                (grants[Manifest.permission.ACCESS_COARSE_LOCATION] == true) ||
                hasPerm(Manifest.permission.ACCESS_FINE_LOCATION) ||
                hasPerm(Manifest.permission.ACCESS_COARSE_LOCATION)
            cb.invoke(origin, granted, false)
        }
    }

    private fun hasPerm(perm: String): Boolean {
        return ContextCompat.checkSelfPermission(this, perm) == PackageManager.PERMISSION_GRANTED
    }

    /**
     * Native JavaScript Interface (`window.RollupNative`) for saving & sharing binary `.cscwalk.zip`,
     * `.abt`, `.csv`, `.json`, and `.pdf` bundles + hardware-gated USB-C OTG UDS read-only serial access.
     */
    inner class RollupNativeBridge {

        @JavascriptInterface
        fun saveBase64File(filename: String, mimeType: String, base64Data: String): Boolean {
            return try {
                val safeName = filename.replace(Regex("[^a-zA-Z0-9._-]"), "_").ifBlank { "RollupOS_Export.bin" }
                val safeMime = mimeType.ifBlank { "application/octet-stream" }
                val cleanB64 = if (base64Data.contains(",")) base64Data.substringAfter(",") else base64Data
                val bytes = Base64.decode(cleanB64, Base64.DEFAULT)

                writeBytesToMediaOrDownloads(safeName, safeMime, bytes)
                val destLabel = if (safeMime.lowercase().startsWith("image/")) {
                    "Gallery (Pictures/CSC_Site_Discovery)"
                } else {
                    "Downloads"
                }
                runOnUiThread {
                    Toast.makeText(
                        this@MainActivity,
                        "Saved to $destLabel: $safeName",
                        Toast.LENGTH_LONG
                    ).show()
                }
                true
            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(
                        this@MainActivity,
                        "Export error: ${e.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
                false
            }
        }

        @JavascriptInterface
        fun shareBase64File(filename: String, mimeType: String, base64Data: String, title: String): Boolean {
            return try {
                val safeName = filename.replace(Regex("[^a-zA-Z0-9._-]"), "_").ifBlank { "RollupOS_Export.bin" }
                val safeMime = mimeType.ifBlank { "application/octet-stream" }
                val cleanB64 = if (base64Data.contains(",")) base64Data.substringAfter(",") else base64Data
                val bytes = Base64.decode(cleanB64, Base64.DEFAULT)

                val savedUri = writeBytesToMediaOrDownloads(safeName, safeMime, bytes)
                if (savedUri != null) {
                    val shareTitle = title.ifBlank { safeName }
                    runOnUiThread {
                        try {
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = safeMime
                                putExtra(Intent.EXTRA_STREAM, savedUri)
                                putExtra(Intent.EXTRA_SUBJECT, shareTitle)
                                clipData = ClipData.newUri(contentResolver, shareTitle, savedUri)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                            startActivity(Intent.createChooser(shareIntent, shareTitle))
                        } catch (e: Exception) {
                            Toast.makeText(
                                this@MainActivity,
                                "Saved ($safeName)",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    }
                    true
                } else {
                    false
                }
            } catch (_: Exception) {
                false
            }
        }

        @JavascriptInterface
        fun shareMultipleBase64Files(filesJson: String, title: String): Boolean {
            return try {
                val arr = JSONArray(filesJson)
                if (arr.length() == 0) return false
                val uris = ArrayList<Uri>()
                var allImages = true
                for (i in 0 until arr.length()) {
                    val item = arr.optJSONObject(i) ?: continue
                    val rawName = item.optString("filename", "CSC_Photo_${i + 1}.jpg")
                    val safeName = rawName.replace(Regex("[^a-zA-Z0-9._-]"), "_").ifBlank { "CSC_Photo_${i + 1}.jpg" }
                    val safeMime = item.optString("mimeType", "image/jpeg").ifBlank { "image/jpeg" }
                    if (!safeMime.lowercase().startsWith("image/")) {
                        allImages = false
                    }
                    val rawB64 = item.optString("base64Data", "")
                    if (rawB64.isBlank()) continue
                    val cleanB64 = if (rawB64.contains(",")) rawB64.substringAfter(",") else rawB64
                    val bytes = Base64.decode(cleanB64, Base64.DEFAULT)
                    val uri = writeBytesToMediaOrDownloads(safeName, safeMime, bytes)
                    if (uri != null) {
                        uris.add(uri)
                    }
                }
                if (uris.isEmpty()) return false
                val shareTitle = title.ifBlank { "Share ${uris.size} Files" }
                runOnUiThread {
                    try {
                        val shareIntent = if (uris.size == 1) {
                            Intent(Intent.ACTION_SEND).apply {
                                type = if (allImages) "image/jpeg" else "*/*"
                                putExtra(Intent.EXTRA_STREAM, uris[0])
                                putExtra(Intent.EXTRA_SUBJECT, shareTitle)
                                clipData = ClipData.newUri(contentResolver, shareTitle, uris[0])
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                        } else {
                            val multiClip = ClipData.newUri(contentResolver, shareTitle, uris[0])
                            for (idx in 1 until uris.size) {
                                multiClip.addItem(ClipData.Item(uris[idx]))
                            }
                            Intent(Intent.ACTION_SEND_MULTIPLE).apply {
                                type = if (allImages) "image/*" else "*/*"
                                putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris)
                                putExtra(Intent.EXTRA_SUBJECT, shareTitle)
                                clipData = multiClip
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                        }
                        startActivity(Intent.createChooser(shareIntent, shareTitle))
                    } catch (e: Exception) {
                        Toast.makeText(
                            this@MainActivity,
                            "Saved ${uris.size} file(s)",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
                true
            } catch (_: Exception) {
                false
            }
        }

        @JavascriptInterface
        fun usbIsSupported(): Boolean = true

        @JavascriptInterface
        fun usbListDevices(): String {
            return try {
                val mgr = getSystemService(Context.USB_SERVICE) as UsbManager
                val prober = UsbSerialProber.getDefaultProber()
                val arr = JSONArray()
                for (driver in prober.findAllDrivers(mgr)) {
                    val dev = driver.device
                    val obj = JSONObject()
                    obj.put("deviceId", dev.deviceId)
                    obj.put("deviceName", dev.deviceName)
                    obj.put("vendorId", dev.vendorId)
                    obj.put("productId", dev.productId)
                    obj.put("productName", dev.productName ?: "USB Serial Adapter")
                    obj.put("manufacturerName", dev.manufacturerName ?: "")
                    obj.put("driver", driver.javaClass.simpleName)
                    obj.put("hasPermission", mgr.hasPermission(dev))
                    arr.put(obj)
                }
                JSONObject().put("ok", true).put("devices", arr).toString()
            } catch (e: Exception) {
                JSONObject().put("ok", false).put("error", e.message ?: "USB list failed").toString()
            }
        }

        @JavascriptInterface
        fun usbRequestPermission(deviceId: Int): String {
            return try {
                val mgr = getSystemService(Context.USB_SERVICE) as UsbManager
                val serialDevs = UsbSerialProber.getDefaultProber().findAllDrivers(mgr).map { it.device }
                val dev = serialDevs.firstOrNull { it.deviceId == deviceId }
                    ?: mgr.deviceList.values.firstOrNull { it.deviceId == deviceId }
                    ?: serialDevs.firstOrNull()
                    ?: mgr.deviceList.values.firstOrNull()
                    ?: return JSONObject().put("ok", false).put("error", "No USB serial adapter plugged into USB-C OTG").toString()

                if (mgr.hasPermission(dev)) {
                    return JSONObject().put("ok", true).put("granted", true).put("deviceId", dev.deviceId).toString()
                }
                val intent = Intent(ACTION_USB_PERMISSION).apply {
                    setPackage(packageName)
                }
                val flags = PendingIntent.FLAG_UPDATE_CURRENT or
                    (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_MUTABLE else 0)
                val pi = PendingIntent.getBroadcast(this@MainActivity, 0, intent, flags)
                mgr.requestPermission(dev, pi)
                JSONObject().put("ok", true).put("granted", false).put("pending", true).put("deviceId", dev.deviceId).toString()
            } catch (e: Exception) {
                JSONObject().put("ok", false).put("error", e.message ?: "USB permission request failed").toString()
            }
        }

        @JavascriptInterface
        fun usbConnect(deviceId: Int, baudRate: Int): String {
            return try {
                closeUsbPortSafely(restoreSession = false)
                val mgr = getSystemService(Context.USB_SERVICE) as UsbManager
                val drivers = UsbSerialProber.getDefaultProber().findAllDrivers(mgr)
                val driver = drivers.firstOrNull { it.device.deviceId == deviceId } ?: drivers.firstOrNull()
                    ?: return JSONObject().put("ok", false).put("error", "No supported USB-Serial OBD adapter detected").toString()
                val dev = driver.device
                if (!mgr.hasPermission(dev)) {
                    return JSONObject().put("ok", false).put("needsPermission", true).put("deviceId", dev.deviceId)
                        .put("error", "USB permission not yet granted; tap Grant USB Permission first").toString()
                }
                val conn = mgr.openDevice(dev)
                    ?: return JSONObject().put("ok", false).put("error", "Android UsbManager.openDevice() returned null").toString()
                val port = driver.ports.firstOrNull()
                    ?: run {
                        conn.close()
                        return JSONObject().put("ok", false).put("error", "Driver exposed zero serial ports").toString()
                    }
                val safeBaud = if (baudRate in listOf(38400, 115200, 230400, 500000, 1000000, 2000000)) baudRate else 115200
                port.open(conn)
                port.setParameters(safeBaud, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE)
                try { port.dtr = true } catch (_: Exception) {}
                try { port.rts = true } catch (_: Exception) {}

                var latencyMs = -1
                val isFtdi = port is FtdiSerialDriver.FtdiSerialPort
                if (isFtdi) {
                    try {
                        (port as FtdiSerialDriver.FtdiSerialPort).latencyTimer = 1
                        latencyMs = (port as FtdiSerialDriver.FtdiSerialPort).latencyTimer
                    } catch (_: Exception) {}
                }

                synchronized(usbLock) {
                    usbConnection = conn
                    usbPort = port
                    lastHeaderAddress = null
                    activeExtendedAddress = null
                }
                runOnUiThread {
                    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                }

                JSONObject()
                    .put("ok", true)
                    .put("deviceId", dev.deviceId)
                    .put("productName", dev.productName ?: "USB OBD Adapter")
                    .put("driver", driver.javaClass.simpleName)
                    .put("baudRate", safeBaud)
                    .put("isFtdi", isFtdi)
                    .put("latencyMs", latencyMs)
                    .put("readOnlyHardwareGate", true)
                    .toString()
            } catch (e: Exception) {
                closeUsbPortSafely(restoreSession = false)
                JSONObject().put("ok", false).put("error", e.message ?: "USB connect failed").toString()
            }
        }

        @JavascriptInterface
        fun usbTransact(command: String, timeoutMs: Int, parkedConfirmed: Boolean): String {
            val validCmd = try {
                validateUsbCommand(command, parkedConfirmed)
            } catch (se: SecurityException) {
                return JSONObject()
                    .put("ok", false)
                    .put("blocked", true)
                    .put("error", se.message ?: "Blocked by compiled read-only UDS gate")
                    .toString()
            }
            return try {
                synchronized(usbLock) {
                    val port = usbPort
                        ?: return JSONObject().put("ok", false).put("error", "USB adapter is not connected").toString()
                    if (validCmd.startsWith("ATSH") && validCmd.length == 7) {
                        lastHeaderAddress = validCmd.substring(4)
                    } else if (validCmd == "1003") {
                        activeExtendedAddress = lastHeaderAddress
                    } else if (validCmd == "1001") {
                        activeExtendedAddress = null
                    }
                    val lines = writeRawLineLocked(port, validCmd, timeoutMs)
                    val arr = JSONArray()
                    lines.forEach { arr.put(it) }
                    JSONObject().put("ok", true).put("blocked", false).put("lines", arr).toString()
                }
            } catch (e: Exception) {
                JSONObject().put("ok", false).put("blocked", false).put("error", e.message ?: "USB I/O error").toString()
            }
        }

        @JavascriptInterface
        fun usbDisconnect(): String {
            closeUsbPortSafely(restoreSession = true)
            return JSONObject().put("ok", true).toString()
        }

        @JavascriptInterface
        fun usbSetKeepScreenOn(keepOn: Boolean): Boolean {
            runOnUiThread {
                if (keepOn) {
                    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                } else {
                    window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                }
            }
            return true
        }

        @JavascriptInterface
        fun lanSyncRequest(url: String, method: String, token: String, jsonBody: String): String {
            return try {
                val uri = URI(url.trim())
                val scheme = (uri.scheme ?: "").lowercase()
                val host = uri.host ?: ""
                val port = uri.port
                val path = uri.path ?: ""
                val cleanMethod = method.trim().uppercase()
                if (scheme != "http" || !isAllowedLanHost(host) || port !in 1..65535) {
                    return JSONObject()
                        .put("ok", false)
                        .put("status", 0)
                        .put("error", "LAN Sync restricted to private IPv4 HTTP endpoints (192.168.x.x / 10.x.x.x / 172.16-31.x.x / 100.64-127.x.x)")
                        .toString()
                }
                if (!isAllowedLanSyncPath(path)) {
                    return JSONObject()
                        .put("ok", false)
                        .put("status", 0)
                        .put("error", "Disallowed LAN Sync endpoint path: $path")
                        .toString()
                }
                if (cleanMethod !in setOf("GET", "POST")) {
                    return JSONObject()
                        .put("ok", false)
                        .put("status", 0)
                        .put("error", "Unsupported HTTP method: $cleanMethod")
                        .toString()
                }
                val conn = (uri.toURL().openConnection() as HttpURLConnection).apply {
                    requestMethod = cleanMethod
                    connectTimeout = 5000
                    readTimeout = 60000
                    useCaches = false
                    setRequestProperty("Accept", "application/json")
                    if (token.isNotBlank()) {
                        val cleanTok = token.trim()
                        setRequestProperty("X-Sync-Token", cleanTok)
                        setRequestProperty("X-Gravity-Token", cleanTok)
                        setRequestProperty("Authorization", "Bearer $cleanTok")
                    }
                    if (cleanMethod == "POST") {
                        doOutput = true
                        val payloadBytes = jsonBody.toByteArray(StandardCharsets.UTF_8)
                        setRequestProperty("Content-Type", "application/json; charset=utf-8")
                        setFixedLengthStreamingMode(payloadBytes.size)
                        outputStream.use { os ->
                            os.write(payloadBytes)
                            os.flush()
                        }
                    }
                }
                val status = conn.responseCode
                val stream = if (status in 200..299) conn.inputStream else (conn.errorStream ?: conn.inputStream)
                val bodyText = stream?.bufferedReader(StandardCharsets.UTF_8)?.use { it.readText() } ?: ""
                conn.disconnect()
                JSONObject()
                    .put("ok", status in 200..299)
                    .put("status", status)
                    .put("body", bodyText)
                    .toString()
            } catch (e: Exception) {
                JSONObject()
                    .put("ok", false)
                    .put("status", 0)
                    .put("error", e.message ?: "LAN Sync network error")
                    .toString()
            }
        }
    }

    private fun writeBytesToMediaOrDownloads(filename: String, mimeType: String, bytes: ByteArray): Uri? {
        val isImage = mimeType.lowercase().startsWith("image/")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val collection = if (isImage) {
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI
            } else {
                MediaStore.Downloads.EXTERNAL_CONTENT_URI
            }
            val relPath = if (isImage) {
                Environment.DIRECTORY_PICTURES + "/CSC_Site_Discovery"
            } else {
                Environment.DIRECTORY_DOWNLOADS
            }
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                put(MediaStore.MediaColumns.RELATIVE_PATH, relPath)
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }
            val uri = contentResolver.insert(collection, values)
            if (uri != null) {
                contentResolver.openOutputStream(uri)?.use { out ->
                    out.write(bytes)
                    out.flush()
                }
                val doneValues = ContentValues().apply {
                    put(MediaStore.MediaColumns.IS_PENDING, 0)
                }
                try {
                    contentResolver.update(uri, doneValues, null, null)
                } catch (_: Exception) {}
                return uri
            }
        }
        val fallbackSubDir = if (isImage) Environment.DIRECTORY_PICTURES else Environment.DIRECTORY_DOWNLOADS
        val dir = getExternalFilesDir(fallbackSubDir) ?: filesDir
        if (!dir.exists()) dir.mkdirs()
        val outFile = File(dir, filename)
        FileOutputStream(outFile).use { out ->
            out.write(bytes)
            out.flush()
        }
        return try {
            FileProvider.getUriForFile(this, "${packageName}.fileprovider", outFile)
        } catch (_: Exception) {
            Uri.fromFile(outFile)
        }
    }

    private fun createCameraCaptureIntent(): Intent? {
        return try {
            val dir = getExternalFilesDir(Environment.DIRECTORY_PICTURES) ?: filesDir
            if (!dir.exists()) dir.mkdirs()
            val file = File(dir, "CSC_Cam_${System.currentTimeMillis()}.jpg")
            val uri = FileProvider.getUriForFile(this, "${packageName}.fileprovider", file)
            pendingCameraCaptureFile = file
            pendingCameraCaptureUri = uri
            Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                putExtra(MediaStore.EXTRA_OUTPUT, uri)
                clipData = ClipData.newRawUri("", uri)
                addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
        } catch (_: Exception) {
            pendingCameraCaptureFile = null
            pendingCameraCaptureUri = null
            null
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val usbFilter = IntentFilter().apply {
            addAction(ACTION_USB_PERMISSION)
            addAction(UsbManager.ACTION_USB_DEVICE_DETACHED)
        }
        ContextCompat.registerReceiver(this, usbReceiver, usbFilter, ContextCompat.RECEIVER_EXPORTED)
        usbReceiverRegistered = true

        window.statusBarColor = Color.parseColor("#070B14")
        window.navigationBarColor = Color.parseColor("#070B14")

        webView = WebView(this).apply {
            setBackgroundColor(Color.parseColor("#070B14"))
        }
        setContentView(webView)

        val ws = webView.settings
        ws.javaScriptEnabled = true
        ws.domStorageEnabled = true
        ws.databaseEnabled = true
        ws.setGeolocationEnabled(true)
        ws.allowFileAccess = true
        ws.allowContentAccess = true
        ws.mediaPlaybackRequiresUserGesture = false
        ws.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        ws.cacheMode = if (isOnline()) WebSettings.LOAD_DEFAULT else WebSettings.LOAD_CACHE_ELSE_NETWORK
        ws.userAgentString = ws.userAgentString + " RollupOSAndroid/1.3"

        webView.addJavascriptInterface(RollupNativeBridge(), "RollupNative")

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val reqUri = request?.url ?: return false
                val url = reqUri.toString()
                val reqScheme = (reqUri.scheme ?: "").lowercase()
                val reqHost = reqUri.host ?: ""
                if (url.startsWith("https://andrewnicks-lang.github.io/android-rollup-app") ||
                    url.startsWith("https://accounts.google.com") ||
                    (reqScheme == "http" && isAllowedLanHost(reqHost))
                ) {
                    return false
                }
                return try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                } catch (e: Exception) {
                    false
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                if (request == null) return
                val missingOsPerms = mutableListOf<String>()
                for (res in request.resources) {
                    if (res == PermissionRequest.RESOURCE_AUDIO_CAPTURE && !hasPerm(Manifest.permission.RECORD_AUDIO)) {
                        missingOsPerms.add(Manifest.permission.RECORD_AUDIO)
                    }
                    if (res == PermissionRequest.RESOURCE_VIDEO_CAPTURE && !hasPerm(Manifest.permission.CAMERA)) {
                        missingOsPerms.add(Manifest.permission.CAMERA)
                    }
                }
                if (missingOsPerms.isEmpty()) {
                    request.grant(request.resources)
                } else {
                    pendingWebPermRequest = request
                    webMediaPermLauncher.launch(missingOsPerms.distinct().toTypedArray())
                }
            }

            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                if (origin == null || callback == null) return
                if (hasPerm(Manifest.permission.ACCESS_FINE_LOCATION) ||
                    hasPerm(Manifest.permission.ACCESS_COARSE_LOCATION)
                ) {
                    callback.invoke(origin, true, false)
                } else {
                    pendingGeoOrigin = origin
                    pendingGeoCallback = callback
                    locationPermLauncher.launch(
                        arrayOf(
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        )
                    )
                }
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback
                pendingCameraCaptureFile?.let { f ->
                    if (f.exists() && f.length() == 0L) {
                        try { f.delete() } catch (_: Exception) {}
                    }
                }
                pendingCameraCaptureFile = null
                pendingCameraCaptureUri = null

                val isCapture = fileChooserParams?.isCaptureEnabled == true
                val rawAccepts = fileChooserParams?.acceptTypes
                    ?.map { it.trim().lowercase() }
                    ?.filter { it.isNotEmpty() }
                    ?: emptyList()
                val wantsArchiveOrMixed = !isCapture && rawAccepts.any {
                    it.contains("zip") || it.contains("json") || it.contains("octet-stream") || it.startsWith(".")
                }
                val wantsImages = isCapture || rawAccepts.any { it.contains("image") || it.endsWith(".jpg") || it.endsWith(".png") }

                val intent = try {
                    if (isCapture) {
                        createCameraCaptureIntent() ?: (fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                            addCategory(Intent.CATEGORY_OPENABLE)
                            type = "image/*"
                        })
                    } else if (wantsArchiveOrMixed) {
                        Intent(Intent.ACTION_GET_CONTENT).apply {
                            addCategory(Intent.CATEGORY_OPENABLE)
                            type = "*/*"
                        }
                    } else {
                        val baseIntent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                            addCategory(Intent.CATEGORY_OPENABLE)
                            type = if (wantsImages) "image/*" else "*/*"
                        }
                        if (wantsImages && hasPerm(Manifest.permission.CAMERA)) {
                            val camIntent = createCameraCaptureIntent()
                            if (camIntent != null) {
                                Intent.createChooser(baseIntent, "Select or Capture Photo").apply {
                                    putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(camIntent))
                                }
                            } else {
                                baseIntent
                            }
                        } else {
                            baseIntent
                        }
                    }
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    return false
                }

                if (isCapture && !hasPerm(Manifest.permission.CAMERA)) {
                    pendingChooserIntent = intent
                    cameraPermLauncher.launch(Manifest.permission.CAMERA)
                    return true
                }

                return try {
                    fileChooserLauncher.launch(intent)
                    true
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    false
                }
            }
        }

        // Support both HTTP links AND WebView `blob:` URL downloads seamlessly
        webView.setDownloadListener { url, _, contentDisposition, mimeType, _ ->
            try {
                if (url.startsWith("blob:")) {
                    val fallbackName = contentDisposition
                        ?.substringAfter("filename=", "")
                        ?.trim('"', ' ', ';')
                        ?.ifBlank { "RollupOS_Download.bin" } ?: "RollupOS_Download.bin"
                    val safeMime = mimeType ?: "application/octet-stream"
                    val js = """
                        (function() {
                          fetch(${org.json.JSONObject.quote(url)})
                            .then(function(r) { return r.blob(); })
                            .then(function(b) {
                              var reader = new FileReader();
                              reader.onloadend = function() {
                                if (window.RollupNative) {
                                  window.RollupNative.saveBase64File(
                                    ${org.json.JSONObject.quote(fallbackName)},
                                    ${org.json.JSONObject.quote(safeMime)},
                                    reader.result
                                  );
                                }
                              };
                              reader.readAsDataURL(b);
                            });
                        })();
                    """.trimIndent()
                    webView.evaluateJavascript(js, null)
                } else if (url.startsWith("http")) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                }
            } catch (_: Exception) {}
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        if (savedInstanceState == null) {
            webView.loadUrl(HUB_URL)
        } else {
            webView.restoreState(savedInstanceState)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onDestroy() {
        closeUsbPortSafely(restoreSession = true)
        if (usbReceiverRegistered) {
            try {
                unregisterReceiver(usbReceiver)
            } catch (_: Exception) {}
            usbReceiverRegistered = false
        }
        super.onDestroy()
    }

    private fun isOnline(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val net = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(net) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}
