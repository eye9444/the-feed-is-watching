# The Feed Is Watching

**Live campaign:** [https://eye9444.github.io/the-feed-is-watching/](https://eye9444.github.io/the-feed-is-watching/)

An interactive public-awareness campaign about social-media recommendation algorithms, designed for a Professional Ethics course. Twelve fictional feed posts demonstrate how user signals can shape rankings while the accompanying ethics notebook explains benefits, risks, safeguards, rights, and engineers' professional duties. Every post includes an original inline SVG pencil illustration.

> Educational prototype only. This project is not affiliated with any social-media platform and does not collect, persist, or transmit visitor data.

## Run locally

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To validate the submission:

```bash
npm test
npm run build
npm run preview
```

The production output is written to `dist/`. Vite uses the `/the-feed-is-watching/` base path in GitHub Actions and a relative base for local builds.

## Interaction model

The feed starts with six topic scores of `1`. When reaction tracking is permitted, Like adds `2` and Share adds `3`. “Not interested” subtracts `2` with a lower limit of `0`. The feed sorts by topic score while retaining original order for ties. “Why this?” reveals the recommendation reason without changing the profile.

All state lives in React memory. Refreshing the page clears it. The simulation never invokes location APIs, browser storage, analytics, cookies, accounts, or a backend.

## Assignment coverage

| Requirement | Campaign section |
| --- | --- |
| Technology explanation | How a feed learns + Feed Laboratory |
| Benefits and risks | Useful—and powerful |
| Ethical principles | Nine questions before “ship it” |
| Privacy and data protection | Consent should not be camouflage |
| Informed consent | Opening consent controls + privacy chapter |
| User and human protection | People need rights—and exits |
| Professional responsibility | Engineers make ethical choices |
| Research and engineering integrity | Engineer lifecycle panel |
| Public trust | Trust must be earned in public |
| Responsible innovation | Govern, map, measure, and manage panel |
| Learning outcomes | What will you notice now? |
| Reflection | Private `submission/Reflection.docx` deliverable |

## Accessibility and privacy

- Semantic headings, landmarks, buttons, lists, and dialog labels
- Keyboard-visible focus, skip link, live status announcements, and 44-pixel controls
- Responsive layouts for phones and desktops
- Reduced-motion and print styles
- Text alternatives for meaningful SVG illustrations and hidden semantics for decorative drawings
- No external fonts, image requests, trackers, or real personal data

## Deployment

Pushes to `main` run tests, build the Vite project, and deploy `dist/` through the least-privilege GitHub Pages workflow in `.github/workflows/deploy.yml`. In the repository's **Settings → Pages**, the source must be set to **GitHub Actions**.

The separate Word reflection and editable reflection source are stored in the ignored `submission/` directory so personal coursework details do not enter the public repository.

## Primary sources

- [IEEE-CS/ACM Software Engineering Code of Ethics](https://www.computer.org/education/code-of-ethics)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [European Commission Trustworthy AI Guidelines](https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai)
- [European Commission guidance on individual data rights](https://commission.europa.eu/law/law-topic/data-protection/reform/rights-citizens/how-my-personal-data-protected/how-should-my-consent-be-requested_en)

Legal protections differ by jurisdiction. Campaign content is ethics education, not legal advice.
