---
title: "PHP2Shell: How Two Critical PHP RCE Bugs Crossed the Request Boundary"
subtitle: "A deep technical report on CVE-2026-109618 and CVE-2026-109619: how out-of-memory bailout corruption and stale worker state became remote code execution, how PHP maintainers responded, and what defenders should do now."
date: "2026-10-21"
lastUpdated: "2026-10-21"
readTime: "18 min read"
mood: "Deep-Dive"
image: "/images/placeholder.svg"
tags: ["PHP security", "Vulnerability research", "Remote code execution", "Incident response"]
relatedTopics: ["Memory safety", "Use-after-free", "Coordinated disclosure", "Runtime security"]
citations: [{"title":"PHP security advisory: critical remote code execution vulnerabilities","url":"https://www.php.net/archive/2026.php#2026-10-21-5","publisher":"PHP.net"},{"title":"RCE via OOM corruption (GHSA-w8hw-w9fx-j79w)","url":"https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w","publisher":"PHP / GitHub Security Advisories"},{"title":"RCE via stale global state (GHSA-6wmf-4rv5-p3rp)","url":"https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp","publisher":"PHP / GitHub Security Advisories"},{"title":"Today's PHP security release, and how we're strengthening PHP security","url":"https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/","publisher":"The PHP Foundation"},{"title":"PHP Remote Code Execution (PHP2Shell)","url":"https://watchtowr.com/intelligence/php-remote-code-execution-php2shell/","publisher":"watchTowr"}]
---

# PHP2Shell: How Two Critical PHP RCE Bugs Crossed the Request Boundary

> **Status as of October 21, 2026:** PHP has released fixes. “Unpatched” describes the brief window before the coordinated release, not the current state. The fixed upstream releases are PHP 8.5.12, 8.4.27, 8.3.36, and 8.2.35. Check your operating-system or hosting vendor for the corresponding package if it backports PHP security fixes.

On October 20, PHP maintainers announced an upcoming emergency release for two critical bugs rated **9.2 under CVSS v4.0**. Before the details were public, the CVE identifiers leaked and a proof-of-concept video was mistakenly exposed. PHP moved the planned release forward by one day. The October 21 advisory then confirmed that both issues could permit unauthenticated remote code execution in PHP installations serving web requests.

The pair is often called **PHP2Shell** in public reporting; that nickname is not the PHP project’s own designation. The bugs are separate, though they share a dangerous theme: PHP’s request machinery has to unwind partially completed work safely, and long-lived server workers retain some engine state between requests.

This report explains the public root-cause analysis and exploit preconditions in detail. It does not include a weaponized request, heap-layout recipe, or shell payload. The PHP advisories establish the vulnerability classes and confirmed paths, but do not publish the complete exploit implementation.

## At a glance

| CVE | Root cause | Exploit condition in the public advisory | Fixed upstream releases |
|---|---|---|---|
| [CVE-2026-109618](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) | OOM bailout leaves request data partially initialized; shutdown may process invalid state | Trigger an allocation failure at a sensitive point, then reach cleanup that assumes initialization completed | 8.2.35, 8.3.36, 8.4.27, 8.5.12 |
| [CVE-2026-109619](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) | Worker-global state still points into a prior request’s freed memory | A producer leaves request-owned state published; a later request on the same worker consumes it before reset | 8.2.35, 8.3.36, 8.4.27, 8.5.12 |

PHP says all web-facing SAPIs require attention: PHP-FPM, Apache `mod_php`, `php-cgi`, FrankenPHP, and LiteSpeed. The highest demonstrated risk is Apache `mod_php`, where a request can reach vulnerable engine behavior before application code starts. The exact path and preconditions vary by SAPI and application; the CVSS score alone does not mean every configuration has the same exploit chain.

## The runtime detail that connects the bugs

PHP’s request lifecycle has two kinds of state. Request-owned allocations—such as strings, arrays, parsed form fields, and error data—are cleaned up at the end of a request. A long-lived worker, however, remains alive to serve more requests. It also holds engine and extension globals that must be reset at the right point in the lifecycle.

This creates a strict invariant: before PHP releases request memory, no persistent worker state may still refer to it; and if request startup fails halfway through, shutdown must know exactly which pieces were initialized. Violating either half can turn a routine error path into memory corruption or a use-after-free.

PHP’s historical out-of-memory path used a non-local bailout. In broad terms, `zend_bailout()` transfers control out of the current engine operation rather than returning normally through each stack frame. That is useful when the request must stop immediately, but it means cleanup and bookkeeping placed after the failed allocation may never run. The critical question is whether the shutdown path can safely inspect state that the interrupted operation had not finished constructing.

## CVE-2026-109618: OOM corruption during request startup and shutdown

The first flaw is a mismatch between an abrupt OOM bailout and later cleanup. Some internal request data becomes reachable before initialization is complete. If an allocation fails in that interval, the bailout can skip the code that would have completed or marked the data invalid. A later shutdown path may then read, branch on, or release that partially initialized data as if it were valid.

The failed allocation does **not** have to be the allocation that owns the invalid object. It is enough for an allocation failure to interrupt an operation while some other request state is temporarily published. This distinction matters: an attacker does not need to overflow the exact buffer that will later be mishandled. They need to drive the runtime into an interruption point where the engine’s internal invariants have not yet been restored.

### How a remote request can reach OOM

PHP’s advisory describes multiple multipart parsing patterns that can produce memory pressure even when the apparent request size seems bounded:

- A multipart request with no usable declared content length may pass an early `post_max_size` check while decoded body data continues to arrive.
- A multipart part may contain many headers. Their in-memory representation can cost substantially more than their encoded wire size.
- Empty file controls do not count toward `max_file_uploads`, yet still create file metadata arrays. Deeply nested input names add more array construction and memory use.
- Application code can also reach OOM through attacker-controlled allocations or repeated memory use.

The useful security lesson is that a byte cap on the raw HTTP body is not always equivalent to a cap on PHP’s decoded and represented data. Parsing, hash tables, metadata, and nested values can amplify memory consumption.

### Why `mod_php` has the strongest demonstrated path

Apache’s `mod_php` invokes request shutdown even when request startup has failed. A multipart body is parsed automatically during startup, before the application’s front controller or route handler runs. If parsing exhausts the configured memory limit while internal state is only partly initialized, startup bails out; the SAPI then proceeds into cleanup that can encounter that invalid state.

The chain is therefore conceptually:

```text
Unauthenticated HTTP request
        ↓
PHP parses attacker-influenced request data
        ↓
An allocation fails while request structures are partially initialized
        ↓
Non-local OOM bailout skips normal bookkeeping
        ↓
mod_php still enters request shutdown
        ↓
Cleanup treats invalid internal state as initialized state
        ↓
Memory corruption can be shaped into remote code execution
```

The public advisory says the demonstrated `mod_php` path can occur before application code runs. It does not publish the exact heap grooming, corrupted structure, or final control-transfer sequence, so claims that a particular public script or payload is the canonical exploit should be treated cautiously.

The SAPI distinction is important. PHP-FPM terminates a child when request startup fails, which prevents that exact failed-startup state from being reused in the same way. The PHP advisory still considers FPM susceptible: after normal startup, application-driven OOM can occur in a context that mishandles an early exit and leaves invalid state for request shutdown. The PHP Foundation says RCE was also confirmed on FPM through application-level paths. FrankenPHP has a shutdown model that makes the startup path look similar to `mod_php`; the advisory calls this likely susceptible. LSAPI resembles FPM, with application-specific paths considered likely but not validated in the advisory.

### What the OOM patch changes

The fix removes the unsafe `longjmp()` bailout from the relevant OOM path. Instead, PHP records a **soft OOM** and delays it until a VM safe point, where the runtime can stop execution without abandoning an internal operation halfway through its bookkeeping. If memory reaches a second, higher hard limit, PHP terminates the process with `_exit()` rather than continuing into cleanup with inconsistent state. The aim is to preserve normal request memory limits while keeping shutdown away from invalid request data.

## CVE-2026-109619: a use-after-free across requests

The second issue is a worker-lifetime bug. PHP and extensions keep global state for errors, sessions, objects, and other subsystems. Some of that state contains pointers into memory owned by the current request. If an operation is interrupted before its matching reset, PHP may free the request heap but leave a global pointer behind.

The next HTTP request is normally expected to initialize or reset those globals before using them. The vulnerability appears when an operation can run **before** that normal initialization and consume the stale pointer. The producer and consumer are separate events, usually on separate requests, but those requests must be handled by the same persistent worker for the demonstrated cross-request case.

The advisory’s model is:

1. A reachable PHP operation publishes request-owned state into a location the worker can access later.
2. A fatal interruption prevents the matching reset, or a later diagnostic repopulates state after it was cleared.
3. PHP releases the request heap while the worker still holds a reference into it.
4. The worker receives another request.
5. Before normal request initialization clears the reference, an early operation reads, frees, or branches on the stale value.

Fatal interruptions can include parse or compile failures, uncaught errors, a failed `require`, maximum-execution-time termination, and OOM. A nonfatal warning during later shutdown can also repopulate request-owned error state. “Nonfatal” does not make this harmless: the issue is the lifetime of the data, not whether PHP logs it or returns an HTTP error.

### Confirmed consumers and deployment differences

PHP’s advisory describes two confirmed early consumers:

- **Early INI diagnostics.** A warning, notice, or deprecation while applying configuration can touch stale error state before ordinary executor initialization. Under `mod_php`, directory-level settings such as `.htaccess` values are applied before `php_request_startup()`, creating one path to such diagnostics. Disabling display or log output does not prevent the internal state access; the access happens before PHP decides whether to report it.
- **Session upload progress.** Multipart upload-progress handling can run before ordinary session initialization. It can read session or decoder state left by an interrupted earlier request. The feature is enabled by default, and PHP says no application call to `session_start()` is required for this path.

The PHP 8.5 advisory also identifies fatal-error backtrace state as a confirmed producer: fatal error reporting stores a request-owned backtrace, and shutdown misses the corresponding global reset. A later diagnostic can reach the stale value before request initialization. PHP describes this as the strongest demonstrated case behind the `mod_php` RCE.

For PHP-FPM, the exact failed-startup producer is less useful because the child exits after startup failure. The validated FPM path instead requires the application to publish relevant state during an otherwise successful request, then hit a fatal interruption; a later upload-progress operation on that same dynamic-pool worker can consume the stale state. In other words, FPM is not categorically safe, but its exploit path is more dependent on the application and worker lifecycle.

At the memory level, a use-after-free becomes exploitable when the stale reference can be made to point at attacker-influenced contents after the allocator reuses the freed space. A carefully shaped heap can make later reads or branches interpret recycled bytes as meaningful engine state. PHP’s advisory confirms that a strategically crafted heap layout can achieve RCE, but does not disclose the complete layout or payload. The central security failure is the stale pointer crossing a request boundary; the details needed to turn that primitive into code execution depend on the affected state and runtime path.

### What the state-reset patch changes

The fix resets the wider set of request-owned global state before the next request can reach operations that run ahead of normal initialization. This covers error, session, object, and extension-related state, including paths where shutdown or a fatal interruption could otherwise skip a reset. The maintainers emphasize that no generic configuration switch covers every possible producer and consumer; the complete runtime patch is the reliable fix.

## What maintainers did, and why the response accelerated

The [PHP Foundation’s post-release account](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/) describes a long discovery and remediation period rather than a bug found and fixed overnight:

- **2024:** During PHP’s external security audit, a core developer found early signs of the OOM issue while fixing an audit finding. A possible exploit was theorized, but no concrete vector was known. The team considered several fixes, each with tradeoffs involving compatibility, denial-of-service risk, or changes across third-party extensions. Consensus-driven decision-making and limited specialist capacity caused work to stall and restart.
- **May–September 2026:** The Foundation created an Ecosystem Security Team and added dedicated security triage and hardening capacity. It also expanded sanitizer builds and reproduction environments.
- **July–September 2026:** Calif’s PHP audit began July 30. Calif and OpenAI independently reported the same OOM root cause on August 11; Wiz and OpenAI supplied further attack vectors. The reports clarified that the old OOM concern was a practical RCE, and it became the security team’s top priority.
- **October 20:** The CVE IDs circulated publicly with an incorrect score and release time. PHP moved its pre-announcement forward, then moved the release from October 22 to October 21 to limit the time between disclosure and a fix. A mistakenly published video showed a proof of concept working and accelerated the spread of PoCs. The Foundation says its team did not identify a functional exploit among the PoCs it inspected at release time.
- **October 21:** PHP published full advisories and released security updates for all four supported branches. Distributions and long-term-support vendors had received the patches in advance to prepare packages. PHP also published minimal source backports for PHP 7.4, 8.0, and 8.1 for users without a vendor fix.

The project also acknowledged a process failure: once the full impact became clear in August, the patch became urgent, but the team’s small size and consensus process made a deep runtime fix difficult to land quickly. The Foundation says it is moving toward majority decisions and earlier leadership involvement when a security fix faces hard tradeoffs. That context matters because both bugs sit under common runtime paths—memory management and error handling—where a rushed patch could break compatibility or introduce new failure modes.

### Exploitation status: separate observation from confirmation

The PHP Foundation says it had not identified a functional exploit in the PoCs it reviewed by the time of the public release. Separately, watchTowr reported observing exploitation attempts against both CVEs. Those statements describe different telemetry and timestamps; neither establishes a confirmed successful compromise of a particular installation. With public details and PoCs circulating, defenders should assume scanning and exploit attempts will increase and investigate suspicious PHP worker behavior around the exposure window.

## Defensive response

### 1. Upgrade the PHP runtime that actually serves traffic

Use the fixed release for your branch—8.2.35, 8.3.36, 8.4.27, or 8.5.12—or install the security update from your Linux distribution, hosting provider, or long-term-support vendor. Restart or reload PHP-FPM, Apache, and other persistent workers so they stop executing the old runtime. A CLI `php -v` check alone does not prove that the web-facing FPM pool, container image, or embedded runtime is patched.

PHP 8.1 and older no longer receive regular upstream updates. The project supplied minimal source backports for 7.4, 8.0, and 8.1, and some vendors may provide their own backports. Verify the exact package and advisory with your vendor; do not assume an old version is fixed because its upstream version string did not change.

### 2. Treat configuration mitigations as temporary exposure reduction

PHP’s advisory calls updating the only complete fix. If an update is temporarily unavailable, it recommends the following specific reductions, each with limits:

- For **CVE-2026-109618**, enforce `memory_limit=-1` administratively so applications cannot restore a finite per-request limit. This removes the predictable memory-limit trigger, but an underlying allocator failure can still reach the vulnerable path. Pair it with a container or cgroup memory boundary for availability; PHP explicitly warns against substituting `RLIMIT_AS` or `RLIMIT_DATA`.
- Keep `post_max_size` conservative, ensure `upload_max_filesize` is lower, and enforce decoded-body size and multipart complexity at the proxy or web server. Bound input fields, multipart part count, per-part headers, and nesting depth, including requests without a usable `Content-Length`.
- For confirmed **CVE-2026-109619** session paths, set `session.upload_progress.enabled=0` in configuration applied before request parsing, then restart every worker. Do not depend on `ini_set()` or `.user.ini` for this early path. On PHP 8.5, `fatal_error_backtraces=0` blocks the confirmed backtrace producer only.
- Repair attacker-reachable fatal errors and timeouts, including failure paths in callbacks, upload/import processing, and cleanup. This reduces specific stale-state producers; it is not a comprehensive control.

These measures reduce selected attack paths and can affect application behavior. They do not make an unpatched runtime safe, and an edge filter cannot account for every application-specific OOM or stale-state route.

### 3. Review exposure and investigate

Inventory PHP wherever it runs: Apache modules, FPM pools, CGI/FastCGI, containers, serverless images, and vendor appliances. Prioritize public-facing `mod_php` instances and systems that accept multipart uploads. Check every container base image and rebuild/redeploy it; a host update does not update PHP inside an image.

For systems that were exposed before patching, review web and PHP-FPM logs for unusual multipart request patterns, repeated memory exhaustion, worker crashes or restarts, and unexpected child processes from PHP workers. PHP’s public advisories do not provide a universal exploit signature, so an absent log line is not proof that a request was harmless. Preserve relevant logs and escalate anomalous behavior through your incident-response process.

## The broader lesson

Both vulnerabilities are reminders that memory safety is not only about bounds checks. It also depends on lifecycle discipline: whether every partially initialized object is marked as such, whether non-local exits preserve cleanup invariants, and whether pointers into request-scoped memory are cleared before the next request can observe them.

PHP’s emergency release closes two concrete routes to RCE, while its disclosure explains why the fix took time: the OOM flaw appeared as a difficult engine-design problem before researchers supplied practical exploit paths. The best operational response is clear—patch the runtime, restart the workers, verify the serving version, and treat configuration workarounds as a bridge rather than a destination.

## Sources

- [PHP security release and affected deployment guidance](https://www.php.net/archive/2026.php#2026-10-21-5)
- [PHP advisory for CVE-2026-109618: OOM corruption](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)
- [PHP advisory for CVE-2026-109619: stale global state](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)
- [The PHP Foundation: discovery, fix, disclosure timeline, and security-process changes](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)
- [watchTowr: PHP2Shell telemetry and release timeline](https://watchtowr.com/intelligence/php-remote-code-execution-php2shell/)
