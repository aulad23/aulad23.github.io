# Aulad Hossain — Portfolio

Personal portfolio for Aulad Hossain, Python Developer | Web Scraping & Automation Specialist.
Built with Next.js (App Router), TypeScript and Tailwind CSS, exported as a static site and deployed to GitHub Pages.

Live: https://aulad23.github.io/

## Run locally

```bash
npm ci
npm run dev          # http://localhost:3000
```

Production build (same as GitHub Pages):

```bash
npm run build   # output in ./out
```

## Update content

All text lives in `data/` — no layout changes needed:

| File | What it controls |
|---|---|
| `data/site.ts` | name, title, hero text, contact links (email, LinkedIn, GitHub, WhatsApp), photo settings |
| `data/skills.ts` | skill groups |
| `data/repos.ts` | the Projects section — title, description, details, tags and GitHub link for each project |
| `data/experience.ts` | experience timeline (add `period` / `details` when ready), workflow stages, journey |

Set any contact value to `""` to hide it.

## Change the profile photo from the live site

1. Create a GitHub fine-grained token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → **Generate new token**.
   - Repository access: **Only select repositories → aulad23.github.io**
   - Permissions → Repository → **Contents: Read and write**
2. On the live site, click the photo and log in with the editor name and password.
3. The first time, also paste the GitHub token. It is saved only in that browser (localStorage); after that, name and password are enough.
4. Choose the new photo and press **Update photo**.

The site saves the image to `public/images/profile.jpg` on `main` and `images/profile.jpg` on `gh-pages`; visitors see it in about a minute.
The real protection is the GitHub token: anyone without it cannot change the photo, even if they know the name and password.

To change the editor name/password, generate a new hash and replace `LOGIN_HASH` in `components/ProfilePhoto.tsx`:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('NAME:PASSWORD').digest('hex'))"
```

You can also replace `public/images/profile.jpg` directly and push.

## Deployment

The site is served by GitHub Pages from the `gh-pages` branch of `aulad23.github.io` (Settings → Pages → Source: **Deploy from a branch → gh-pages / root**). The source code lives on `main`.

To publish changes:

```bash
git pull          # get any photo changed from the live site
npm run deploy    # builds the site and pushes ./out to gh-pages
git push          # save the source on main
```

The site updates at https://aulad23.github.io/ about a minute later. `/portfolio` redirects to the home page for old links.

## Update the resume

The downloadable resume lives in `public/resume/` (PDF and Word). It is generated from `scripts/build_resume.py` (with the photo from `public/images/profile.jpg`), which is laid out for applicant tracking systems: one column, standard headings, plain selectable text, no tables or graphics.

1. Edit the content at the top of `scripts/build_resume.py` (summary, skills, experience, projects, education).
2. Run:

```bash
pip install reportlab python-docx pillow
python scripts/build_resume.py
```

3. Commit the updated files in `public/resume/`.
