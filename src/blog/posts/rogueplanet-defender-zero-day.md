---
title: "RoguePlanet: The Defender Zero-Day That Turned Protection Into Privilege"
subtitle: "A deep research report on Nightmare-Eclipse, the mass disclosure campaign, and the destructive Microsoft Defender race condition tracked as CVE-2026-50656."
date: "2026-07-22"
lastUpdated: "2026-07-22"
readTime: "16 min read"
mood: "Deep-Dive"
image: "/images/rogueplanet-defender-zero-day.png"
tags: ["Vulnerability research","Microsoft Defender","Windows security","Incident response"]
relatedTopics: ["Race conditions","Privilege escalation","Endpoint detection"]
citations: [{"url":"https://msrc.microsoft.com/update-guide/","publisher":"Microsoft","title":"Microsoft Security Response Center"}]
---
# RoguePlanet: The Defender Zero-Day That Turned Protection Into Privilege

This is a deep research report on **Nightmare-Eclipse**, his history, his zero-day disclosures, and an exhaustive technical breakdown of **RoguePlanet (CVE-2026-50656)**, the most destructive vulnerability he unleashed.

---

## Researcher Profile: Nightmare-Eclipse

**Nightmare-Eclipse** is also tracked as *Chaotic Eclipse*, *Dead Eclipse*, and *MSNightmare*. He is an anonymous vulnerability researcher who initiated a **revenge-driven, mass zero-day disclosure campaign** against Microsoft starting in April 2026.

### Identity & Motive

The researcher's true identity remains unknown, though unverified rumors suggest a possible background as a former Microsoft employee. The campaign stems from a bitter dispute with the Microsoft Security Response Center (MSRC). Nightmare-Eclipse claims that Microsoft:

- Ignored his responsible vulnerability reports.
- Rejected his submissions without proper triage.
- Revoked his MSRC researcher portal access.
- Refused to pay bounties for valid bugs.

> Direct quote from his release notes: "Microsoft violated an agreement and 'left me homeless with nothing.'"

### Platform Bans & Escalation

- **May 23, 2026:** GitHub, owned by Microsoft, terminated his account.
- **May 26, 2026:** GitLab followed with a permanent ban.
- Microsoft's Digital Crimes Unit disabled his access to the MSRC portal.

In response, Nightmare-Eclipse deployed a **dead man's switch**, threatening to automatically release a cache of unfixed vulnerabilities if his accounts were permanently silenced. He continues to resurface via new burner accounts.

---

## Full List of Zero-Days Unleashed

Since April 2026, he has publicly dropped at least **9 Windows zero-day vulnerabilities**:

| Exploit Name | Affected Component | Vulnerability Type | CVE ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **BlueHammer** | Windows Defender | TOCTOU Race Condition -> SYSTEM EoP | CVE-2026-33825 | Patched |
| **RedSun** | Windows Defender | Cloud File Rollback Abuse -> SYSTEM EoP | None assigned | Claimed silently patched |
| **UnDefend** | Windows Defender | Signature Update Pipeline Freeze (DoS) | None assigned | Unpatched |
| **YellowKey** | BitLocker | BitLocker Drive Encryption Bypass | CVE-2026-50507 | Patched |
| **GreenPlasma** | Windows CTFMON | Local Privilege Escalation | CVE-2026-45586 | Patched |
| **MiniPlasma** | Windows Component | Local Privilege Escalation | - | Unpatched |
| **RoguePlanet** | **Microsoft Defender** | **TOCTOU Race Condition -> SYSTEM EoP** | **CVE-2026-50656** | **Patched (July 2026)** |
| **GreatXML** | BitLocker | BitLocker Bypass (alternate vector) | - | Unpatched |
| **LegacyHive** | User Profile Service | Load other user's hive -> EoP | None yet | Unpatched |

> Confirmed in-the-wild exploitation: Huntress Labs confirmed that as of April 10, 2026, **BlueHammer, RedSun, and UnDefend** were weaponized in the wild. Attackers gained initial access via compromised FortiGate VPN appliances, then used these vulnerabilities for privilege escalation.

---

## RoguePlanet (CVE-2026-50656) - The Most Destructive Zero-Day

RoguePlanet is widely considered the crown jewel, and the most terrifying, of Nightmare-Eclipse's arsenal.

### Vulnerability Overview

| Attribute | Detail |
| :--- | :--- |
| **CVE ID** | CVE-2026-50656 |
| **CVSS Score** | **7.8 (High)** |
| **Affected Component** | **Microsoft Malware Protection Engine (mpengine.dll)** |
| **Vulnerability Type** | TOCTOU (Time-of-Check, Time-of-Use) Race Condition (CWE-59: Improper Link Resolution) |
| **Impact** | Local Privilege Escalation to **NT AUTHORITY\SYSTEM** |
| **Affected Systems** | Windows 10, Windows 11 (fully patched June 2026 updates) |
| **Not Affected** | Officially Windows Server, though the researcher claims servers are vulnerable with a redesigned exploit |

---

## Technical Deep-Dive: How RoguePlanet Works

The sheer danger of RoguePlanet lies in **turning the antivirus into the attack vector**. Instead of attacking the kernel directly, the exploit manipulates Microsoft Defender's scanning and quarantine processes to execute malicious code with the highest system privileges.

### The Attack Chain

1. **Malicious Payload Preparation:** The attacker crafts a malicious file embedded within an ISO image, utilizing **NTFS Alternate Data Streams (ADS)** and virtual ISO mounting techniques to hide the payload from casual inspection.
2. **Triggering Defender Scan:** A low-privileged user, or a script running under a standard user context, forces Microsoft Defender to scan this malicious container file.
3. **The Race Condition Window:** Defender performs a security check on the file, the *Time-of-Check*. There is then a microscopic delay before it accesses the file for processing, the *Time-of-Use*. This is the TOCTOU window.
4. **Opportunistic Locks to Win the Race:** The exploit uses **oplock** requests on the target file. These locks allow the attacker to pause Defender's file operations precisely during the check phase, reliably winning the race condition on specific system configurations.
5. **Path Redirection via NTFS Junctions:** After Defender finishes its safety check, but before it processes the file, the attacker uses **NTFS Directory Junctions** to redirect the file path to a sensitive system location, such as `C:\Windows\System32\config`.
6. **Volume Shadow Copy Abuse:** The exploit chains the redirection with **Volume Shadow Service (VSS)** snapshots. By pointing Defender to a shadow copy of a protected system file, the attacker tricks the privileged Defender process into operating on files it normally would not have permission to touch.
7. **SYSTEM Shell Spawn:** Because Defender operates as `NT AUTHORITY\SYSTEM`, the exploited process executes the attacker's redirected file with SYSTEM privileges. The final step spawns a SYSTEM-level command prompt, `conhost.exe`.

> Researcher's note on reliability: "The exploit is a race condition, so it's a hit or miss. I have managed to get a 100% success rate on some machines while it struggled to work on others."

---

## Why It Is Called Most Destructive

- **No memory corruption required:** It bypasses modern memory protection mitigations such as DEP, ASLR, and CFG.
- **No admin rights needed:** A standard, unprivileged user can trigger it.
- **Defender Real-Time Protection OFF does not matter:** Even if the user disables real-time scanning, background scheduled scans and manual scans remain vulnerable.
- **Passive mode exposure:** Even if Defender is running in passive mode alongside a third-party AV, `mpengine.dll` remains loaded and vulnerable.

---

## Attack Flow Diagram

```text
[Low-Privileged User]
       |
       v
[Creates Malicious ISO with ADS]
       |
       v
[Triggers Defender Scan] ----> [Defender opens file (TOCTOU Check)]
       |                              |
       |                              v (Time delay)
       |                      [Oplock PAUSES Defender]
       |                              |
       |                              v
       |               [Attacker swaps path via NTFS Junction]
       |                              |
       |                              v
       |               [Defender continues (Time-of-Use)]
       |                              |
       |                              v
       |           [Defender now points to SYSTEM Registry Hive]
       |                              |
       |                              v
       +----------------> [SYSTEM Privilege Execution]
                                    |
                                    v
                          [SYSTEM Shell Spawned]
```

## File System IOC Map

```text
C:\Users\[User]\AppData\Local\Temp\
    └── {UUID-Generated-Folder}/
        └── RP_Data/
             ├── mountpoint (Junction to C:\Windows\System32\config)
             └── payload.mal
```

---

## Mitigation & Remediation

### Official Patch

Microsoft began pushing the fix on **July 9, 2026**. The patch is delivered automatically via the **Microsoft Malware Protection Engine version 1.1.26060.3008**.

- **Action:** Users do not need to manually update; the engine auto-updates within 24-48 hours.
- **Verification:** Check `C:\ProgramData\Microsoft\Windows Defender\Platform\` for the engine version.

### Active Defense & Detection

If you are hunting for RoguePlanet before the patch is universally deployed, implement these detections:

- **Named pipe:** Monitor for creations connecting to `\\.\pipe\RoguePlanet`, hardcoded in the PoC.
- **Process anomaly:** Alert on `services.exe` spawning `conhost.exe` directly. This is highly abnormal.
- **WerMgr.exe abuse:** Check if `wermgr.exe`, Windows Error Reporting, is launched from `%TEMP%` instead of System32.
- **File system monitoring:** Alert on UUID-formatted directories in `%TEMP%` followed immediately by subdirectories named `RP_*`.
- **Junction auditing:** Enable auditing for **NTFS Junction creation** by non-administrative users, especially Event ID 4656 or 4663 with relevant access masks.
- **EDR/XDR rules:** Detect processes enumerating Volume Shadow Copies, such as `vssadmin list shadows` or `wmic shadowcopy`, immediately after a file-write event to an ISO or container.

### Incident Response

1. **Isolate the host** immediately from the network.
2. **Forensic triage:** Dump the memory of the `MsMpEng.exe` process to identify the redirected file path.
3. **Task Scheduler check:** Review the `QueueReporting` task, which attackers may use for persistence after exploitation.
4. **Rebuild when necessary:** If you find evidence of SYSTEM-level `conhost.exe` spawning from non-standard paths, treat the host as deeply compromised.

---

## Post-Patch Controversy

Even after Microsoft released the fix for RoguePlanet, Nightmare-Eclipse reverse-engineered the patch and claimed it introduced **new memory leaks** and improper quarantine handling. Furthermore, security researchers reported that the patch could be **abused to exhaust disk space** by manipulating Defender to continuously write quarantine files until the drive is full.

---

## Final Summary

The Nightmare-Eclipse saga highlights a breaking point in the vulnerability disclosure ecosystem:

- The tension between **Coordinated Vulnerability Disclosure (CVD)** and **Full Disclosure** as political weapons.
- The power asymmetry between independent security researchers and trillion-dollar technology companies.
- The dangerous precedent of platform governance, especially Microsoft owning GitHub, being leveraged in security disputes.

**RoguePlanet** stands as the ultimate symbol of this conflict. It does not just give an attacker SYSTEM access; it weaponizes the very software meant to protect the machine, forcing the guardian to become the assassin.

