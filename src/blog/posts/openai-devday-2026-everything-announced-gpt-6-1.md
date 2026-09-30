---
title: "OpenAI DevDay 2026: Every Major Announcement, Explained"
subtitle: "Dots, GPT-6.1 Sol, Codex, ChatGPT Space, new APIs, plugins, and a Pro tier: a practical breakdown of OpenAI’s biggest developer event—and why GPT-6.1 followed GPT-6 so quickly."
date: "2026-09-30"
lastUpdated: "2026-09-30"
readTime: "13 min read"
mood: "Analytical"
image: "/images/placeholder.svg"
tags: ["OpenAI", "DevDay 2026", "GPT-6.1", "AI agents", "Codex", "Cybersecurity"]
relatedTopics: ["Agentic AI", "AI developer tools", "Model economics", "AI security"]
citations: [{"publisher":"OpenAI","title":"DevDay 2026 Recap: Every announcement","url":"https://openai.com/index/devday-2026-recap/"},{"publisher":"OpenAI","title":"Introducing dots","url":"https://openai.com/index/introducing-dots/"},{"publisher":"OpenAI","title":"Introducing GPT-6.1 Sol","url":"https://openai.com/index/introducing-gpt-6-1-sol/"},{"publisher":"OpenAI Developers","title":"API Changelog","url":"https://developers.openai.com/api/docs/changelog"},{"publisher":"Associated Press","title":"Altman unveils always-on AI agent after OpenAI shelves model over safety concerns","url":"https://apnews.com/article/sam-altman-openai-conference-dots-agent-77b6b8888145869206996d7509d24256"},{"publisher":"TechCrunch","title":"OpenAI launches GPT-6 Sol and Luna, boasting lower cost and fewer mistakes","url":"https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/"}]
---

# OpenAI DevDay 2026: Every Major Announcement, Explained

OpenAI’s September 29 DevDay was less a single product launch than a map of where the company wants AI to go next: from answering prompts to carrying work across apps, collaborating with teams, and operating for longer stretches with a person supervising the important decisions.

The official recap lists more than 20 announcements spanning ChatGPT, Codex, models, APIs, plugins, and enterprise tools. The announcements vary widely in maturity—some are available now, some are limited previews or betas, and others are coming later—so the distinction between a launch and a promise matters. This guide groups the releases by what they do and what they could mean in practice. [OpenAI’s full DevDay recap](https://openai.com/index/devday-2026-recap/) is the primary source for the feature descriptions and availability below.

## The headline: AI that keeps working after the prompt

The most visible announcement was **Dots**, OpenAI’s always-on personal agents. A Dot is designed to carry context across connected apps, maintain ongoing projects, do background research, and ask for review or approval when an action needs a person. OpenAI says Dots run on GPT-6 Astra, use their own cloud computer, can connect to more than 4,000 apps through its plugin ecosystem, and can be reached through ChatGPT, Slack, or Teams. The initial rollout is for eligible Pro and Business Premium users; Enterprise, Education, and Healthcare access is a workspace-admin-enabled beta. [OpenAI’s Dots announcement](https://openai.com/index/introducing-dots/) describes the product’s permissions, approval controls, and safeguards in more detail.

That “always on” promise is also the most consequential risk shift. An assistant that drafts an email when asked is different from one that watches connected systems and decides when to act. OpenAI says background proactive research is read-only, actions can be bounded with custom rules, and consequential actions may require approval. Those are useful controls, but organizations will still need to decide which data a Dot can see, which tools it can call, and how to audit its work. Agents that can access real accounts and software make identity, least privilege, and incident logging part of the product design—not cleanup tasks for later.

## The models: a faster follow-up, with one important caveat

The timeline is easy to blur, so here it is plainly:

- **September 22:** OpenAI released **GPT-6 Sol** and **GPT-6 Luna**, its reasoning models positioned at different capability and cost points.
- **September 29:** DevDay brought **GPT-6.1 Sol**, a substantial upgrade to Sol, plus **Ultrafast**, a premium low-latency option for GPT-6 Astra.
- **Also September 29:** OpenAI said it was delaying **GPT-6.1 Astra** after safety researchers raised concerns. It was not a DevDay launch.

So the week brought the GPT-6 family’s first Sol and Luna models, then a .1 update to Sol. It did **not** bring two successive releases of a general “GPT-6.0” and “GPT-6.1” model: GPT-6.1 Sol is a specific model variant, and the high-end Astra .1 version remained unreleased. [OpenAI’s API changelog](https://developers.openai.com/api/docs/changelog) confirms the September 22 Sol/Luna and September 29 Sol 6.1 dates. The company’s [GPT-6.1 Sol announcement](https://openai.com/index/introducing-gpt-6-1-sol/) says the new model targets coding, computer use, and professional work, with near-Astra performance at one-fifth of its standard input and output token prices. It also supports multi-agent delegation in beta.

**Ultrafast** is a speed tier, not another model family. OpenAI says it can raise GPT-6 Astra generation speed by up to eight times in Codex and six times in the API, for customers willing to pay for latency-sensitive workloads. GPT-6.1 Sol Ultrafast was described as coming soon.

### Why release GPT-6.1 just a week after GPT-6 Sol and Luna?

OpenAI has not published a definitive explanation for the one-week cadence, so any answer is interpretation. A few business and product incentives line up:

1. **Make frontier capability cheaper to use.** GPT-6.1 Sol’s headline is not just a new version number; it is advanced coding and computer-use performance at a much lower price than Astra. The September 22 Sol/Luna launch had already emphasized efficiency and lower API prices. A quick follow-up lets OpenAI show that the new generation can improve while becoming more economical.
2. **Give DevDay a concrete developer release.** A named model with API support, pricing, and multi-agent features is something developers can test immediately. The timing also links the model to a wider story about Codex, agents, and automation rather than presenting it as an isolated benchmark jump.
3. **Ship the parts that are ready while holding back the riskier one.** The same day, OpenAI delayed GPT-6.1 Astra over concerns about its behavior and security. That contrast suggests the release train is not simply “announce everything at once”: a lower-cost model could meet the release bar while the most capable model still needs more work. The AP reported that OpenAI’s safety lead said Astra had become more persistent in completing tasks, but did not meet the company’s bar because it needed to balance that capability against unauthorized behavior. [AP’s report on the delay](https://apnews.com/article/open-ai-artificial-intelligence-altman-trump-astra-5afb865b2cddc439efdcf31ebdc406a5) is important context for interpreting the launch.
4. **Compete on the whole developer workflow.** Better model economics are more compelling when paired with remote Codex tasks, computer-use APIs, multi-agent delegation, and shared workspaces. The strategic bet appears to be that developers choose a platform for the system around the model as much as for a single model score.

These motives can coexist. But a tight release schedule is not proof of internal haste or a safety failure by itself. The more useful questions are what changed, how it performs on independent task evaluations, what permissions the agent receives, and whether the company can explain when a model is ready—or not.

## The rest of the announcements, grouped by what they enable

### Building and operating agents

**Agents API with computer use.** The Agents API can now use a browser hosted by OpenAI to interact with websites. The application developer handles sign-in and approvals for website access. OpenAI also describes Codex multi-agent capabilities, tool search, tool calling, and context compaction as part of the developer toolkit. The API builds on the Agents API beta announced earlier in September, extending it from an orchestration harness toward software that can act in a browser.

**Decisions API.** This API narrows a model’s job to a question with a fixed set of possible answers. Developers can send text or images and use the result to classify content, route a request, or select an agent’s next step. The constrained answer space is a practical fit for repeated decisions where a company wants model judgment without handing over open-ended authority. It began in limited preview.

**Amazon Bedrock Managed Agents, powered by OpenAI.** The AWS collaboration brings core Agents API capabilities into Bedrock, with AWS-native customization and integrations. The point is deployment in the customer’s AWS environment, where existing cloud resources and governance already live.

**MCP events for plugin automations.** ChatGPT plugins can respond to events from connected apps, such as a new task appearing on a project board. That makes it possible to start a workflow when something changes instead of waiting for someone to remember to ask.

### Codex, from a coding session to a team workflow

**Codex in the cloud.** Start or monitor a coding task remotely, including from a phone, and use reusable development environments so tasks begin with a shared, approved setup. This makes agent work less tied to one laptop or one developer’s local configuration.

**Refreshed Codex CLI.** The command-line tool gains voice-driven task starts and steering, an `/agents` view for delegating and tracking multiple tasks, and workflow improvements for editing prompts, resuming sessions, and using worktrees. The interface was also refreshed for longer sessions.

**Code Review.** Codex can summarize and inspect changes across projects in the ChatGPT desktop app, help analyze diffs, and prepare feedback for GitHub pull requests or GitLab merge requests. Automatic cloud reviews can take a first pass while the developer is away. Human review remains crucial: generated review comments are suggestions, not a substitute for validating correctness and security.

**Codex Security Cloud.** This service scans GitHub repositories on demand or on a schedule, investigates and deduplicates findings, monitors new commits, and can prepare fixes in the cloud. OpenAI says it includes access to models offered through Daybreak Blue without a separate Daybreak application. For security teams, the practical draw is a continuous loop from finding to proposed remediation; the quality of triage and the approval process still determine whether that loop is safe to automate.

### Making ChatGPT a place to build and collaborate

**ChatGPT Space.** Space is a persistent shared area where a team, ChatGPT, and a Dot can work from common knowledge and project context. It is intended to make work easier to pick up and continue across conversations and collaborators.

**Pages.** Pages are collaborative documents for writing, research, charts, images, and visualizations. People and agents can contribute in one place rather than passing drafts between separate chats and files.

**Collaborative slides.** OpenAI previewed slide creation where multiple teammates and agents can edit together, leave comments, and present inside ChatGPT or export to PowerPoint or Google Slides. The announcement said availability would come in the following weeks.

**Teams and shared tasks.** Business and Enterprise users can create teams to share pages, slides, plugins, and spreadsheets, then delegate recurring work. Tasks can run on a schedule or react to an event such as an email or Slack message.

**@ChatGPT in Slack and Microsoft Teams.** Teams can invoke ChatGPT in channels, threads, or direct messages. It can use tools configured by an administrator or tools available to the individual, so the surrounding access controls and data permissions matter.

**Meetings plugin.** In a macOS desktop beta, the plugin captures meeting notes and creates summaries and action items in Space. OpenAI says the audio is deleted after the notes are generated and cannot be accessed or replayed. Enterprise access was described as coming later.

### Letting developers extend ChatGPT

**Plugin extensions.** Developers can build interactive panels and file viewers that live alongside ChatGPT conversations, giving their product a more complete home inside ChatGPT.

**Improved plugin creation and discovery.** Plugin Creator, a redesigned submission flow, and better ranking and recommendations are intended to reduce friction for builders and help users find relevant tools. Users choose which plugins they enable and approve their access.

**Sites can host plugins.** Supported plugins can be added to Sites, with each teammate using their own connected data and permissions. OpenAI also says it is making automations easier to add and manage.

**Shareable profiles.** Users can collect and share their Sites and plugins so others can discover and reuse them. Workspace skill sharing is also included in the announcement.

**Sign in with ChatGPT.** Users can sign into partner tools with their ChatGPT account and, for participating partners, draw eligible usage from their plan allowance. OpenAI listed 16 partners, including Devin, Notion, Vercel, T3, OpenClaw, and Dactyl. This could reduce account setup friction, while giving users and administrators a new reason to review connected-app permissions and spending controls.

### Business, privacy, and subscription changes

**Private Intelligence.** OpenAI introduced a set of enterprise privacy measures. Zero Data Retention with Private Safety Processing is designed to run automated safety reviews without exposing underlying content to OpenAI personnel. A preview of Private Inference, combining confidential computing and verifiable controls, was described as coming this fall.

**OpenAI Marketplace.** Eligible enterprise customers can apply part of an existing OpenAI commitment to approved partner software. The first 32 partners span design, customer experience, legal, cybersecurity, and open-source models, including Figma, Adobe, Salesforce, ServiceNow, Harvey, Palo Alto Networks, CrowdStrike, and Baseten. This makes OpenAI’s enterprise agreement a potential procurement channel, not just a bill for model usage.

**ChatGPT Pro 500.** A new $500 monthly tier offers 25 times the Plus usage allowance and includes access to Ultrafast. It is aimed at people who are hitting existing usage or speed limits; it is also a clear move to package compute and latency as a premium product.

## What ties the launches together?

The announcements reinforce one another. Dots supply persistent personal agents; Space and Pages provide a shared context for people and agents; plugins connect work to external systems; the Agents API and Decisions API give developers building blocks for their own agents; Codex handles software work; and new subscriptions, model tiers, and marketplace arrangements create ways to pay for the usage.

That is the platform strategy in one sentence: keep more of the work—from identity and context to tools, execution, review, and billing—inside OpenAI’s ecosystem. That may make capable agents easier to build and adopt. It also means teams need to examine lock-in, portability, access scopes, data retention, logging, and human approval before moving consequential workflows into the platform.

DevDay’s biggest shift is not that AI can make a more polished answer. It is that the product is starting to stay present, notice events, and carry tasks forward. The promise is less coordination overhead. The test will be whether people can understand what their agents are doing, constrain the access they have, and reliably step in when an agent gets something wrong.

## Sources and further reading

- [OpenAI: DevDay 2026 Recap](https://openai.com/index/devday-2026-recap/)
- [OpenAI: Introducing dots](https://openai.com/index/introducing-dots/)
- [OpenAI: Introducing GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/)
- [OpenAI Developers: API Changelog](https://developers.openai.com/api/docs/changelog)
- [Associated Press: OpenAI delays GPT-6.1 Astra over security concerns](https://apnews.com/article/open-ai-artificial-intelligence-altman-trump-astra-5afb865b2cddc439efdcf31ebdc406a5)
- [TechCrunch: OpenAI launches GPT-6 Sol and Luna](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-gpt-6-luna/)
