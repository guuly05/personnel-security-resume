# Contributing

Thanks for taking the time to improve this project. Contributions should support the portfolio's purpose, protect its users, and preserve the author's privacy and ownership of personal content.

## Before you start

- For a bug, check existing issues and include steps to reproduce it.
- For a substantial change, open an issue first to discuss the approach.
- Do not submit personal information, credentials, tokens, or other secrets. Do not reuse the author's photos, certificates, writing, or branding outside this project without permission.
- For a suspected security issue, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Set up the project

Use a Node.js version compatible with the Vite version in `package.json`.

```bash
git clone https://github.com/guuly05/personnel-security-resume.git
cd personnel-security-resume
npm install
npm run dev
```

The site is available at `http://localhost:3000`. Contact and booking integrations need provider credentials; see the README for environment setup. Do not put real credentials in commits.

## Make and submit a change

1. Create a focused branch from the default branch.
2. Keep changes consistent with the existing TypeScript, React, and CSS conventions.
3. Update documentation when behavior, configuration, or setup changes.
4. Describe the problem and solution in your pull request. Include screenshots for visible UI changes and list any relevant configuration or migration steps.
5. Be prepared to revise a contribution based on review.

## Checks

Run the checks relevant to your change before opening a pull request:

```bash
npm run lint
npm test
npm run build
npm run verify:seo
```

API, routing, booking, Markdown, or terminal changes should include focused tests. Changes to page rendering or metadata should be checked in the generated output.

## Community standards

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
