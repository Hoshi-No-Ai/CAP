import { existsSync, readFileSync, readdirSync, renameSync, rmdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = resolve('dist/client');
const prefix = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
if (prefix && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(prefix)) throw new Error('Expected a local Pages base path.');
// Vinext puts path-prefixed bundles inside the prefix directory. GitHub Pages
// mounts the artifact at that prefix, so the physical files belong at its root.
if (prefix) {
  const nested = join(root, prefix.slice(1), '_next');
  const destination = join(root, '_next');
  if (existsSync(nested)) {
    if (existsSync(destination)) throw new Error('Ambiguous static bundle directories.');
    renameSync(nested, destination);
    let parent = join(root, prefix.slice(1));
    while (parent !== root && readdirSync(parent).length === 0) { rmdirSync(parent); parent = resolve(parent, '..'); }
  }
}
if (!existsSync(join(root, 'index.html'))) throw new Error('Static export did not emit index.html.');
let references = 0;
for (const file of ['index.html', '404.html']) {
  if (!existsSync(join(root, file))) continue;
  const html = readFileSync(join(root, file), 'utf8');
  for (const match of html.matchAll(/(?:src|href|poster)="([^"]+)"/g)) {
    const value = match[1];
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const pathname = decodeURIComponent(value.split(/[?#]/)[0]);
    if (prefix && !pathname.startsWith(prefix + '/')) throw new Error(`Unprefixed asset: ${value}`);
    const local = join(root, pathname.slice(prefix.length).replace(/^\//, ''));
    if (!existsSync(local)) throw new Error(`Missing static asset: ${value}`);
    references++;
  }
}
function checkSizes(dir) {
  for (const name of readdirSync(dir)) { const path = join(dir, name); const stat = statSync(path);
    if (stat.isDirectory()) checkSizes(path);
    else {
      // Keep media lightweight; the complete paper is served unchanged on GitHub Pages.
      // GitHub permits repository files below 100 MiB.
      const limitMiB = path === join(root, 'assets', 'paper.pdf') ? 100 : 25;
      if (stat.size >= limitMiB * 1024 * 1024) throw new Error(`Asset exceeds ${limitMiB} MiB size budget: ${path}`);
    }
  }
}
checkSizes(root);
console.log(`Static export verified: ${references} resource references; prefix ${prefix || '/'}.`);
