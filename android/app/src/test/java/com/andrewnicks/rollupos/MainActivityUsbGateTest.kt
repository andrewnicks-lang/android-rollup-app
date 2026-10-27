package com.andrewnicks.rollupos

import org.junit.Assert.assertEquals
import org.junit.Assert.fail
import org.junit.Test

class MainActivityUsbGateTest {

    private fun assertRejected(cmd: String, parked: Boolean = true) {
        try {
            MainActivity.validateUsbCommand(cmd, parkedConfirmed = parked)
            fail("Expected SecurityException for command '$cmd' (parked=$parked)")
        } catch (_: SecurityException) {
            // expected
        }
    }

    @Test
    fun allowsIsoTpStnProtocolsAndReadOnlyUdsCommands() {
        assertEquals("STP33", MainActivity.validateUsbCommand("stp33", parkedConfirmed = false))
        assertEquals("STP 33", MainActivity.validateUsbCommand("STP 33", parkedConfirmed = false))
        assertEquals("STP53", MainActivity.validateUsbCommand("stp53", parkedConfirmed = false))
        assertEquals("STP 53", MainActivity.validateUsbCommand("STP 53", parkedConfirmed = false))
        assertEquals("STPRS", MainActivity.validateUsbCommand("stprs", parkedConfirmed = false))
        assertEquals("STPBR500000", MainActivity.validateUsbCommand("stpbr500000", parkedConfirmed = false))
        assertEquals("STPBR125000", MainActivity.validateUsbCommand("stpbr125000", parkedConfirmed = false))
        assertEquals("ATSP6", MainActivity.validateUsbCommand("atsp6", parkedConfirmed = false))
        assertEquals("ATRV", MainActivity.validateUsbCommand("atrv", parkedConfirmed = false))
        assertEquals("22F190", MainActivity.validateUsbCommand("22 F1 90", parkedConfirmed = false))
        assertEquals("22DE00", MainActivity.validateUsbCommand("22DE00", parkedConfirmed = false))
        assertEquals("3E00", MainActivity.validateUsbCommand("3E 00", parkedConfirmed = false))
        assertEquals("1902FF", MainActivity.validateUsbCommand("19 02 FF", parkedConfirmed = false))
        assertEquals("1001", MainActivity.validateUsbCommand("10 01", parkedConfirmed = false))
        assertEquals("1003", MainActivity.validateUsbCommand("10 03", parkedConfirmed = true))
    }

    @Test
    fun blocksRawNonIsoTpCanAndAllWriteOrDestructiveUdsServices() {
        // Raw ISO 11898 CAN without ISO-TP must be rejected on both transceivers
        assertRejected("STP31")
        assertRejected("STP 31")
        assertRejected("STP51")
        assertRejected("STP 51")

        // Extended session without parked confirmation + ProgrammingSession 10 02
        assertRejected("1003", parked = false)
        assertRejected("1002", parked = true)

        // Destructive / write UDS services & raw adapter commands
        assertRejected("2EDE0001")
        assertRejected("2701")
        assertRejected("3101FF00")
        assertRejected("1101")
        assertRejected("14FFFFFF")
        assertRejected("340044")
        assertRejected("STPX H:726,D:2EDE00")
        assertRejected("ATPP FF SV 00")
        assertRejected("ATZ\r2EDE0001")
    }

    @Test
    fun extendsReadDeadlineOnlyOnCompleteUdsResponsePending78Frames() {
        // Incomplete line without CR/LF or normal multi-frame payload containing 7F..78 must NOT extend
        assertEquals(0, MainActivity.countPending78Frames("7F2278"))
        assertEquals(0, MainActivity.countPending78Frames("014\r0: 62 DE 00 7F 22 78\r"))

        // First spaced or unspaced 7F <SID> 78 frame extends deadline by P2* (5500ms)
        val (seen1, dl1) = MainActivity.extendDeadlineForPending78(
            bufferText = "SEARCHING...\r7F 22 78\r",
            seenPendingCount = 0,
            nowMs = 1000L,
            currentDeadlineMs = 2200L,
            maxDeadlineMs = 16000L
        )
        assertEquals(1, seen1)
        assertEquals(6500L, dl1)

        // Re-evaluating the same single frame does NOT extend again
        val (seenSame, dlSame) = MainActivity.extendDeadlineForPending78(
            bufferText = "SEARCHING...\r7F 22 78\r",
            seenPendingCount = seen1,
            nowMs = 3000L,
            currentDeadlineMs = dl1,
            maxDeadlineMs = 16000L
        )
        assertEquals(1, seenSame)
        assertEquals(6500L, dlSame)

        // Second 7F2278 frame extends again, capped cleanly at maxDeadlineMs
        val (seen2, dl2) = MainActivity.extendDeadlineForPending78(
            bufferText = "SEARCHING...\r7F 22 78\r7F2278\r\n",
            seenPendingCount = seen1,
            nowMs = 12000L,
            currentDeadlineMs = dl1,
            maxDeadlineMs = 16000L
        )
        assertEquals(2, seen2)
        assertEquals(16000L, dl2)
    }

    @Test
    fun allowsRfc1918AndTailscaleLanHostsAndWifiDropPathsWhileBlockingPublicOrTraversalTargets() {
        // Private LAN & CGNAT/Tailscale hosts allowed
        assertEquals(true, MainActivity.isAllowedLanHost("10.0.0.91"))
        assertEquals(true, MainActivity.isAllowedLanHost("192.168.1.42"))
        assertEquals(true, MainActivity.isAllowedLanHost("172.16.4.10"))
        assertEquals(true, MainActivity.isAllowedLanHost("172.31.255.1"))
        assertEquals(true, MainActivity.isAllowedLanHost("100.64.10.5"))
        assertEquals(true, MainActivity.isAllowedLanHost("127.0.0.1"))
        assertEquals(true, MainActivity.isAllowedLanHost("localhost"))

        // Public IPv4 & out-of-range octets rejected
        assertEquals(false, MainActivity.isAllowedLanHost("8.8.8.8"))
        assertEquals(false, MainActivity.isAllowedLanHost("172.32.0.1"))
        assertEquals(false, MainActivity.isAllowedLanHost("100.128.0.1"))
        assertEquals(false, MainActivity.isAllowedLanHost("example.com"))

        // Office PC Wi-Fi Drop & FORScan sync paths allowed
        assertEquals(true, MainActivity.isAllowedLanSyncPath("/api/wifi-drop/ping"))
        assertEquals(true, MainActivity.isAllowedLanSyncPath("/api/wifi-drop/jobs"))
        assertEquals(true, MainActivity.isAllowedLanSyncPath("/api/wifi-drop/jobs/CSC-2026-26410"))
        assertEquals(true, MainActivity.isAllowedLanSyncPath("/api/wifi-drop/upload"))
        assertEquals(true, MainActivity.isAllowedLanSyncPath("/sync/status"))

        // Arbitrary or path-traversal endpoints blocked
        assertEquals(false, MainActivity.isAllowedLanSyncPath("/api/wifi-drop/jobs/../../etc/passwd"))
        assertEquals(false, MainActivity.isAllowedLanSyncPath("/admin/exec"))
        assertEquals(false, MainActivity.isAllowedLanSyncPath(""))
    }
}

