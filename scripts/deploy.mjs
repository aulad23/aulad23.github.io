// Publish the built site (./out) to the gh-pages branch of aulad23.github.io.
// Usage:  npm run deploy   (builds first, then runs this script)
// GitHub Pages serves the gh-pages branch, so no GitHub Actions permission is needed.
import { execSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO = "https://github.com/aulad23/aulad23.github.io.git";
const out = join(process.cwd(), "out");
const run = (cmd) => execSync(cmd, { cwd: out, stdio: "inherit" });

if (!existsSync(join(out, "index.html"))) {
  console.error("No build found in ./out — run `npm run build` first.");
  process.exit(1);
}

writeFileSync(join(out, ".nojekyll"), "");
rmSync(join(out, ".git"), { recursive: true, force: true });
run("git init -q -b gh-pages");
run("git add -A");
run('git -c user.name="aulad23" -c user.email="aulad23@users.noreply.github.com" commit -q -m "Deploy site"');
run(`git push -q -f ${REPO} gh-pages`);
rmSync(join(out, ".git"), { recursive: true, force: true });
console.log("Deployed to gh-pages. The site updates at https://aulad23.github.io/ in about a minute.");
