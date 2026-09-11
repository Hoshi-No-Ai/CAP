# CAP — Project Website

**Continuously Adaptive Perception-Blind Humanoid Locomotion via Learned Denoising**

[Project Website](https://hoshi-no-ai.github.io/CAP/) · [arXiv](https://arxiv.org/abs/2609.11553) · [Video](https://youtu.be/GE_GassSkYM) · [Code Repository](https://github.com/Hoshi-No-Ai/CAP/tree/main)

This branch contains the source code and media assets for the CAP project website. The website presents the CoRL 2026 paper, authors, real-world robot demonstrations, method, experimental results, and BibTeX citation.

The research implementation is being prepared for release on the [`main`](https://github.com/Hoshi-No-Ai/CAP/tree/main) branch.

## Repository Organization

| Branch | Purpose |
| --- | --- |
| `main` | Project overview and upcoming training and deployment code. |
| `gh-pages` | Website source, media assets, and GitHub Pages deployment workflow. |

## Local Development

Use Node.js 22.13 or later. Node.js 24 is recommended.

```bash
git clone --branch gh-pages https://github.com/Hoshi-No-Ai/CAP.git cap-website
cd cap-website
npm ci
npm run dev
```

Open the local URL printed by the development server.

## Build and Preview

```bash
npm run typecheck
npm run build
npm start
```

The production build generates a static site in `dist/client/`.

## Deployment

Updates pushed to `gh-pages` are built and published to [GitHub Pages](https://hoshi-no-ai.github.io/CAP/) by the workflow in `.github/workflows/pages.yml`.

For a fork, select **GitHub Actions** under **Settings → Pages → Build and deployment → Source**. The workflow obtains the deployment path from GitHub Pages automatically.

To check a build using this repository's `/CAP` path locally:

```bash
NEXT_PUBLIC_BASE_PATH=/CAP npm run build
npm start
```

## Editing the Website

| Location | Contents |
| --- | --- |
| `app/page.tsx` | Page sections, paper text, and resource links. |
| `app/globals.css` | Layout and visual styles. |
| `app/layout.tsx` | Page metadata. |
| `components/video-gallery.tsx` | Video gallery and playback behavior. |
| `lib/publication.ts` | Paper title, authors, affiliations, and citation. |
| `lib/gallery-data.ts` | Video entries, captions, and ordering. |
| `public/assets/` | Paper PDF, figures, video clips, and posters. |
| `media-sources.json` | Media provenance and editing notes. |

## Media Notes

The website uses figures from the paper and footage from the robot experiments. The full demonstration is hosted on YouTube; shorter clips are included with the website.

Where available, experiment videos include raw depth and world-model reconstructions. The separate recordings in the stairs partial-occlusion clip were aligned visually using motion onset; this alignment does not imply hardware-synchronized timestamps.
