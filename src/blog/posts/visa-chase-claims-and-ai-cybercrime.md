---
title: "Visa, Chase, and the New Shape of Cybercrime"
subtitle: "What is known about the November 2026 extortion claims, what is not, and how AI is changing the scale and speed of cybercrime."
date: "2026-11-17"
lastUpdated: "2026-11-17"
readTime: "12 min read"
mood: "Analytical"
image: "/images/placeholder.svg"
tags: ["Cybersecurity", "Cybercrime", "Financial security", "Artificial intelligence", "Ransomware"]
relatedTopics: ["Third-party risk", "Ransomware", "Social engineering", "Incident response", "AI safety"]
citations: [{"title":"Visa confirms cyberattack as hackers claim JPMorgan was hit too","url":"https://cybernews.com/security/visa-jpmorgan-data-breach/","publisher":"Cybernews"},{"title":"A look at online delays that affected major US banks","url":"https://apnews.com/article/aeb4b0d6b6789c8c96bb2520454a6d1e","publisher":"Associated Press"},{"title":"Detecting and countering misuse of AI: September 2026","url":"https://www.anthropic.com/threat-intelligence-report-september-2026","publisher":"Anthropic"},{"title":"Microsoft Digital Defense Report 2026","url":"https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/CSR/2026-Microsoft-Digital-Defense-Report.pdf","publisher":"Microsoft"},{"title":"Visa Threats Report: As Network Security Strengthens, Criminals Accelerate Shift to AI-Enabled Social Engineering","url":"https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.22466.html","publisher":"Visa"},{"title":"Cyber Brief 26-10: September 2026","url":"https://cert.europa.eu/publications/threat-intelligence/cb26-10/","publisher":"CERT-EU"}]
---

# Visa, Chase, and the New Shape of Cybercrime

On November 16, 2026, a newly emerged extortion group called **n0n** placed Visa and JPMorgan Chase on its victim list and threatened to publish allegedly stolen data. The timing made the claims especially alarming: Chase customers were already reporting trouble accessing online banking, and the outage affected other financial services as well. A high-profile name, a countdown, and a service disruption can quickly become one story in social media and headlines. The evidence so far describes several related-looking events, but it does not establish one coordinated breach of Visa and Chase.

That distinction matters. Cybercrime groups often use public leak sites to pressure organizations, but a listing is an allegation, not independent proof of what was accessed or stolen. At the time of writing, Visa has acknowledged a cyber incident at a third-party service provider in the Asia-Pacific region. It says Visa's own systems were not involved and that it has no indication payment data, including card numbers, was affected. Chase has said its online service problem resulted from a software bug, not a cyberattack. Those statements do not make third-party exposure unimportant; they do set boundaries around what can responsibly be said about the incident.

## What happened, and what has been confirmed

The public account has three separate parts:

1. **n0n made an extortion claim.** The group listed Visa and JPMorgan Chase as alleged victims and set a 48-hour deadline before a promised leak. It did not provide public technical evidence that proves the scope of the claims.
2. **Visa acknowledged a third-party incident.** Visa told Cybernews that the incident originated with a service provider in Asia-Pacific. Visa said its own systems were not impacted and that it had no indication payment data was affected. It has not publicly named the provider.
3. **Chase experienced an outage.** On November 16, users reported delays accessing online accounts at several banks and Zelle after a technical issue at Chase caused ripple effects. Chase told the Associated Press the issue was an isolated software bug and not a cyberattack.

The distinction between Visa and a provider matters because large payment networks depend on a broad ecosystem: processors, technology vendors, data services, call centers, and other contractors. An incident at one supplier can be serious for that supplier and its customers, even when the payment network itself and card data are not affected. It can expose business information, disrupt operations, or create follow-on risks. But the information available publicly does not identify the affected provider, the records involved, or whether the n0n listing and the provider incident are the same event.

Likewise, Chase's outage should not be treated as proof of intrusion simply because it happened around the same time as a criminal group's claim. A software fault can cause widespread disruption when financial services depend on interconnected systems. The bank's public explanation is that the outage came from a bug. More technical detail may emerge later, but an overlap in timing is not evidence of a shared cause.

This is how an incident should be read while facts are still developing: separate what an attacker alleges, what a company confirms, what independent reporting has verified, and what remains unknown. Extortion groups have an incentive to exaggerate their access and to use well-known victim names to attract attention. A company, meanwhile, may disclose information in stages while it investigates. Early reporting is useful, but provisional information should stay labeled as provisional.

## Why third-party incidents are consequential

Supply-chain exposure has become a routine part of organizational risk. A provider may hold support tickets, employee contact details, operational documents, or access credentials. Even if a provider cannot reach payment-card systems, stolen internal information might help an attacker impersonate staff, target customers with convincing messages, or attempt to enter other services. Those are possible downstream risks, not proof that any of them occurred here.

The practical question is not only, “Was the core network breached?” It is also: Which provider was involved? What information did it handle? What access did it have? Were credentials or tokens present in the affected environment? Did the organization revoke access, examine logs, and notify people who need to take action? Until those details are published, outside observers should avoid guessing at the data involved.

For customers, the sensible response is to use the official bank or card issuer app or website, check recent transactions, and contact the number printed on a card or shown in the official app if something looks wrong. A claimed breach is also fertile ground for follow-on scams. A text or email that asks for a password, one-time passcode, card security code, or remote access to a device should be treated with suspicion, even if it references a real news story. Do not follow a link from an unsolicited message to “secure” an account.

## AI is changing the economics of cybercrime

The second part of this story is broader than one ransomware claim. Over the past year, security teams have described attackers using AI to move more quickly through familiar steps: gathering public information, translating and tailoring messages, drafting code, analyzing stolen data, and coordinating work across tools. These uses can lower the effort needed for routine tasks and let a small crew handle more targets. That does not mean every criminal operation uses AI, that every AI-generated message is effective, or that human operators have disappeared.

Microsoft's 2026 Digital Defense Report describes AI-enabled operations moving beyond content generation toward more automation. It reports examples of language models used in malware, AI coding assistants abused for local reconnaissance, and agents supporting multi-step activity. The report also describes the first documented automated ransomware extortion attack in July 2026, while cautioning that the volume of such activity remains low. That is an important measure of the current moment: more capability is appearing, but fully autonomous attacks are still emerging rather than the everyday norm.

Anthropic's September threat report describes cases observed between December 2025 and August 2026 in which suspected state-sponsored groups, financially motivated criminals, and politically motivated individuals tried to use its models for cyber operations and other misuse. The company says it disrupted the activity and shared information with partners where appropriate. It emphasizes that AI's impact can be felt across the attack chain through greater speed, scale, and depth, not only through novel exploit creation. As a provider report, it offers useful operational examples while reflecting the cases visible to that provider; it is not a complete census of cybercrime.

The increased availability of AI also improves the quality of fraud attempts. A criminal can generate fluent messages in more languages, adapt a fake support conversation to a real company, or synthesize a voice that sounds familiar. Visa's own threat reporting describes criminals shifting toward AI-enabled social engineering as network defenses improve. Visa reports ransomware activity increased 26% between July and December 2025 compared with the same period a year earlier, while device-token fraud declined 9.6% in that comparison. Those figures are useful evidence that threats and defenses are changing, but they do not establish that AI alone caused a rise in crime. Criminal markets, stolen credentials, weak security practices, and vulnerable software remain central parts of the picture.

In September, the EU's CERT-EU also highlighted the growth of “LLM-jacking,” where criminals steal or resell access to paid AI services or hijack cloud resources for unauthorized model use. This is a reminder that AI can be both a tool used in crime and a target of crime. Stolen model access can be monetized, used to run workloads, or repackaged for others. The surrounding cloud accounts, API keys, and billing systems become part of the attack surface.

## What AI does not tell us about this case

There is no public evidence that n0n used AI in its claim against Visa or Chase. The available reporting about the incident does not attribute the intrusion to an AI-enabled method, explain how the third-party provider was accessed, or connect the Chase outage to the extortion group. It would be misleading to call this an “AI hack.”

AI belongs in the context because it is changing the capabilities and economics available to criminals across the industry. It does not belong as an assumed explanation for every breach or service outage. The strongest analysis keeps the two ideas together without confusing them: financial institutions face extortion and third-party risks today, and AI is making some kinds of fraud and intrusion faster to prepare and scale. One trend does not prove causation in a particular case.

## Practical steps for organizations and customers

Organizations can use this moment to test whether their incident response covers suppliers as carefully as internal systems. Maintain an inventory of vendors and the data and privileges each one receives. Require strong authentication for vendor access, use least privilege, and make credential revocation quick. Contracts should define prompt incident notification and the information suppliers must provide during an investigation. Backups and recovery plans remain important, but a response plan also needs to cover stolen data and extortion, where restoring systems cannot undo disclosure.

Security teams should also prepare for AI-assisted social engineering. Staff need a way to verify unusual payment, password-reset, and vendor-change requests through a second trusted channel. Help desks and finance teams should have clear procedures for checking identities without relying on caller ID, voice familiarity, or polished writing. Monitoring should account for stolen session tokens and suspicious authentication, not only obvious malware.

Customers should check their accounts through known official channels, enable transaction alerts and multifactor authentication where available, and report unauthorized transactions promptly. If a message claims to be from Visa, Chase, or another provider and creates urgency, independently open the official app or type the known website address. No one should share a one-time code with a caller or message sender who asks for it.

The Visa and Chase headlines show why careful incident reporting matters. One company has acknowledged a problem involving a third party while saying that payment data was not indicated to be affected. Another says its outage was a software bug, not an attack. A criminal group has made claims that should be assessed rather than repeated as established fact. Meanwhile, current threat reports give real reasons to take AI-enabled fraud and operations seriously, while also showing that the technology is an accelerant within a larger criminal ecosystem. Clear facts, prompt supplier response, and disciplined verification are more useful than a dramatic but unsupported conclusion.
