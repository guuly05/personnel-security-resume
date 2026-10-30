---
title: "Your CI/CD Pipeline Is Part of Your Attack Surface"
subtitle: "Build workflows hold code, credentials, and deployment access. Here is how to reduce the risk without making delivery painfully slow."
date: "2026-10-30"
lastUpdated: "2026-10-30"
readTime: "8 min read"
mood: "Practical"
image: "/images/placeholder.svg"
tags: ["DevSecOps", "CI/CD security", "Software supply chain", "GitHub Actions"]
relatedTopics: ["Least privilege", "Dependency security", "Secrets management", "Secure deployment"]
citations: [{"title":"Security hardening for GitHub Actions","url":"https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions","publisher":"GitHub Docs"},{"title":"Security hardening your deployments","url":"https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments","publisher":"GitHub Docs"},{"title":"Configuring OpenID Connect in cloud providers","url":"https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers","publisher":"GitHub Docs"},{"title":"2026 Minimum Elements for a Software Bill of Materials (SBOM)","url":"https://content.govdelivery.com/accounts/USDHSCISA/bulletins/422a7eb","publisher":"CISA"},{"title":"Advisory on Securing the Software Supply Chain and Development Workflows","url":"https://www.csa.gov.sg/alerts-and-advisories/advisories/ad-2026-003/","publisher":"Cyber Security Agency of Singapore"}]
---

# Your CI/CD Pipeline Is Part of Your Attack Surface

When we think about an application's attack surface, we usually picture its public website, API, or servers. But the path that builds and deploys that application can be just as powerful. A CI/CD workflow may check out source code, install packages, run third-party actions, read secrets, publish artifacts, and deploy to production—all with credentials that exist only to make delivery work.

That makes the pipeline part of the product's security boundary. If an attacker can change what runs, influence code that a privileged workflow executes, or steal a deployment credential, the build system can become a shortcut to production.

This is not a reason to stop using automation. It is a reason to give automation only the access each job needs, and to make the path from source to release easier to inspect.

## How a pipeline becomes an attack path

Consider a simplified sequence:

1. A workflow installs a dependency or runs a third-party action.
2. That code executes in a job with repository write access or deployment credentials.
3. Malicious code reads what the job can access, changes the repository, or publishes an altered build.
4. The resulting artifact reaches users through a normal release process.

The weakness may be in a compromised package, a mutable action tag, a leaked token, or a workflow that handles untrusted pull-request content while holding secrets. Each step can appear ordinary when reviewed alone. The risk comes from joining untrusted code to excessive authority.

GitHub's security guidance highlights two useful controls: explicitly limit `GITHUB_TOKEN` permissions and pin third-party actions to full commit SHAs. A tag such as `@v4` is convenient, but its target can move; a reviewed commit SHA identifies the exact action code the workflow will run. [GitHub's hardening guidance](https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions)

## Start with permissions

Set workflow permissions to read-only by default, then grant a job the specific capability it requires. For example, a test workflow that only checks out code and runs tests usually does not need write access to repository contents:

```yaml
permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<reviewed-40-character-commit-sha>
      - run: npm ci
      - run: npm test
```

The placeholder SHA is intentional: use the verified full commit SHA for the action version your team has reviewed. Do not copy an arbitrary hash from an example. If another job needs to publish a release or deploy, give that job its own narrow permissions instead of granting them to every job in the workflow.

This limits the damage a compromised step can do with the workflow token. It does not make untrusted code safe to run with secrets, so keep the trigger and the permissions in view together.

## Treat pull requests as untrusted input

Pull-request workflows often need to build and test contributions. A pull request from a fork can contain changes to application code, build scripts, package lifecycle hooks, or even the workflow itself. If a privileged workflow runs that content while exposing secrets or a write token, the contributor's code may be able to use those privileges.

Keep ordinary pull-request checks read-only and do not expose deployment secrets to them. Be especially careful with workflows that use `pull_request_target`: that event runs in the context of the base repository, which can make secrets or a privileged token available. If it is used to label or comment on a pull request, avoid checking out and executing the pull request's code in that privileged job. Separate untrusted build/test work from any later privileged action, and pass only reviewed outputs across that boundary.

The goal is straightforward: code from an untrusted contribution should not inherit the authority of the repository that receives it.

## Replace long-lived cloud keys where possible

Cloud access keys stored as repository secrets can remain valid long after a workflow has finished. If a deployment provider supports OpenID Connect (OIDC), configure it to trust only the expected repository, branch or protected environment, and workflow context. The workflow can then exchange its identity token for a short-lived cloud credential instead of keeping a long-lived key in GitHub.

OIDC still needs careful trust conditions. A cloud role that trusts every repository or every branch has simply moved the broad access problem elsewhere. GitHub's deployment guidance recommends defining conditions so untrusted repositories cannot request cloud credentials, and using environment protection rules where appropriate. [GitHub's OIDC guidance](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers)

For production deployments, a protected environment can add a review gate, limit which branches deploy, and control when environment secrets are available. Keep build and deployment jobs distinct where practical: tests should not need production access, and the production job should consume a clearly identified artifact rather than rebuild arbitrary code with broader permissions.

## Make dependencies and artifacts visible

The pipeline depends on more than the code in your repository. It also depends on packages, actions, reusable workflows, build images, and the artifact that gets deployed. Pinning actions and using lockfiles make inputs more repeatable. Regularly review updates and remove dependencies that the workflow no longer needs.

For releases where provenance matters, record what source and build process produced the artifact, and verify that provenance before deployment or consumption. A software bill of materials (SBOM) can describe the components included in a release. CISA's 2026 minimum-elements guidance describes a baseline for SBOM data fields, automation support, and practices. An SBOM helps with visibility and response, but it is not proof that the components are safe or that the build itself was trustworthy. [CISA's 2026 SBOM guidance](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/422a7eb)

## A quick workflow review

For each workflow, ask:

- Does it declare the smallest `GITHUB_TOKEN` permissions it needs?
- Are third-party actions pinned to reviewed full commit SHAs?
- Can code from a fork or an untrusted branch reach secrets, write tokens, or deployment credentials?
- Are cloud credentials short-lived and restricted to the intended repository and deployment context?
- Are production environments protected, with deployment access limited to the right branches or reviewers?
- Can you identify the source, dependencies, and build workflow behind a released artifact?
- Do maintainers know how to disable a compromised workflow, rotate credentials, and publish a known-good release?

You do not need a complicated platform to improve this list. Start by removing unnecessary write permissions and secrets from workflows, then tackle mutable dependencies and deployment identity. Those changes reduce the authority available to a compromised step without requiring every pull request to wait for a manual security review.

## Build automation deserves security review

CI/CD systems are privileged software: they process source code, run dependencies, and often bridge development into production. The security question is not just whether the application has vulnerabilities, but also what authority the build process has and who can cause it to use that authority.

Treating workflows as production code makes the answer easier to manage. Keep permissions narrow, isolate untrusted contributions, use short-lived deployment credentials, and preserve enough provenance to understand what was released. A secure pipeline should keep delivery moving while making it harder for one compromised step to become a production incident.
