package com.andrewnicks.rollupos

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
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
import java.io.File
import java.io.FileOutputStream

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var pendingChooserIntent: Intent? = null
    private var pendingWebPermRequest: PermissionRequest? = null
    private var pendingGeoOrigin: String? = null
    private var pendingGeoCallback: GeolocationPermissions.Callback? = null

    companion object {
        private const val HUB_URL = "https://andrewnicks-lang.github.io/android-rollup-app/"
    }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val callback = filePathCallback
        filePathCallback = null
        if (callback == null) return@registerForActivityResult

        if (result.resultCode == Activity.RESULT_OK) {
            val dataUri = result.data?.data
            val clipData = result.data?.clipData
            val uris: Array<Uri>? = when {
                dataUri != null -> arrayOf(dataUri)
                clipData != null && clipData.itemCount > 0 -> {
                    Array(clipData.itemCount) { idx -> clipData.getItemAt(idx).uri }
                }
                else -> null
            }
            callback.onReceiveValue(uris)
        } else {
            callback.onReceiveValue(null)
        }
    }

    // Sequential Camera Permission -> File Chooser Launcher (eliminates first-tap race condition)
    private val cameraPermLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { _ ->
        val intent = pendingChooserIntent
        pendingChooserIntent = null
        if (intent != null) {
            try {
                fileChooserLauncher.launch(intent)
            } catch (_: Exception) {
                filePathCallback?.onReceiveValue(null)
                filePathCallback = null
            }
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
     * `.csv`, `.json`, and `.pdf` bundles directly from WebView mini-apps into Android `Downloads`.
     */
    inner class RollupNativeBridge {

        @JavascriptInterface
        fun saveBase64File(filename: String, mimeType: String, base64Data: String): Boolean {
            return try {
                val safeName = filename.replace(Regex("[^a-zA-Z0-9._-]"), "_").ifBlank { "RollupOS_Export.bin" }
                val safeMime = mimeType.ifBlank { "application/octet-stream" }
                val cleanB64 = if (base64Data.contains(",")) base64Data.substringAfter(",") else base64Data
                val bytes = Base64.decode(cleanB64, Base64.DEFAULT)

                writeBytesToDownloads(safeName, safeMime, bytes)
                runOnUiThread {
                    Toast.makeText(
                        this@MainActivity,
                        "Saved to Downloads: $safeName",
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

                val savedUri = writeBytesToDownloads(safeName, safeMime, bytes)
                if (savedUri != null) {
                    runOnUiThread {
                        try {
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = safeMime
                                putExtra(Intent.EXTRA_STREAM, savedUri)
                                putExtra(Intent.EXTRA_SUBJECT, title.ifBlank { safeName })
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                            startActivity(Intent.createChooser(shareIntent, title.ifBlank { "Share $safeName" }))
                        } catch (e: Exception) {
                            Toast.makeText(
                                this@MainActivity,
                                "Saved to Downloads ($safeName)",
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
    }

    private fun writeBytesToDownloads(filename: String, mimeType: String, bytes: ByteArray): Uri? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
            }
            val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            if (uri != null) {
                contentResolver.openOutputStream(uri)?.use { out ->
                    out.write(bytes)
                    out.flush()
                }
                return uri
            }
        }
        val dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: filesDir
        if (!dir.exists()) dir.mkdirs()
        val outFile = File(dir, filename)
        FileOutputStream(outFile).use { out ->
            out.write(bytes)
            out.flush()
        }
        return Uri.fromFile(outFile)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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
        ws.userAgentString = ws.userAgentString + " RollupOSAndroid/1.1"

        webView.addJavascriptInterface(RollupNativeBridge(), "RollupNative")

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("https://andrewnicks-lang.github.io/android-rollup-app") ||
                    url.startsWith("https://accounts.google.com") ||
                    url.startsWith("http://localhost") ||
                    url.startsWith("http://127.0.0.1") ||
                    url.startsWith("http://192.168.") ||
                    url.startsWith("http://100.")
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

                val intent = try {
                    fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                    }
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    return false
                }

                val isCapture = fileChooserParams?.isCaptureEnabled == true
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

    private fun isOnline(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val net = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(net) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}
