import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Project root = parent of tests/
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS_DIR = path.join(ROOT, 'docs');
const PUBLIC_DIR = path.join(DOCS_DIR, 'public');

/** Recursively list all .md files under docs/ (EN + hi). */
function listAllMd(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

/** Strip a trailing anchor / query from a link target. */
function stripSuffix(target: string): string {
  return target.split('#')[0].split('?')[0];
}

/**
 * Resolve a root-relative link to a doc-page .md file, or null when the
 * link is not a doc-page link of this site. Migrated content still uses
 * the dusrel.com form (/docs/<slug>/, /hi/docs/<slug>/); VitePress-native
 * forms (/<slug>, /hi/<slug>) are handled too.
 */
function docLinkToFile(link: string): string | null {
  const clean = stripSuffix(link).replace(/\/$/, '');
  let m = clean.match(/^\/docs\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
  if (m) return path.join(DOCS_DIR, `${m[1]}.md`);
  m = clean.match(/^\/hi\/docs\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
  if (m) return path.join(DOCS_DIR, 'hi', `${m[1]}.md`);
  m = clean.match(/^\/hi\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
  if (m) return path.join(DOCS_DIR, 'hi', `${m[1]}.md`);
  m = clean.match(/^\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
  if (m) return path.join(DOCS_DIR, `${m[1]}.md`);
  return null;
}

/** Links that point to the main dusrel.com site, not to this docs site. */
function isCrossSiteLink(link: string): boolean {
  return (
    link.startsWith('/pass/') ||
    link.startsWith('/hi/pass/') ||
    link.startsWith('/apps/') ||
    link.startsWith('/hi/apps/')
  );
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;

describe('images referenced in docs', () => {
  it('every image reference exists under docs/public/', () => {
    const missing: string[] = [];
    for (const file of listAllMd(DOCS_DIR)) {
      const text = readFileSync(file, 'utf8');
      const refs = new Set<string>();
      // HTML <img src="..."> and markdown ![alt](...)
      for (const m of text.matchAll(/src\s*=\s*["']([^"']+)["']/g)) refs.add(m[1]);
      for (const m of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) refs.add(m[1]);
      for (const raw of refs) {
        const ref = stripSuffix(raw);
        if (!ref.startsWith('/')) continue; // relative or data: URI — not a public asset
        if (!IMAGE_EXT.test(ref)) continue;
        if (!existsSync(path.join(PUBLIC_DIR, ref))) {
          missing.push(`${path.relative(ROOT, file)} -> ${ref}`);
        }
      }
    }
    expect(missing, `missing images:\n${missing.join('\n')}`).toEqual([]);
  });
});

describe('internal links between doc pages', () => {
  it('every link to another doc page resolves to an existing .md file', () => {
    const broken: string[] = [];
    for (const file of listAllMd(DOCS_DIR)) {
      const text = readFileSync(file, 'utf8');
      const targets = new Set<string>();
      // Markdown links [text](target) — skip images ![alt](...)
      for (const m of text.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        targets.add(m[1]);
      }
      // HTML <a href="...">
      for (const m of text.matchAll(/href\s*=\s*["']([^"']+)["']/g)) targets.add(m[1]);

      for (const raw of targets) {
        const target = stripSuffix(raw);
        if (
          target === '' ||
          target.startsWith('#') ||
          target.startsWith('http://') ||
          target.startsWith('https://') ||
          target.startsWith('mailto:') ||
          target.startsWith('tel:')
        ) {
          continue;
        }
        if (isCrossSiteLink(target)) continue; // /pass/*, /apps/* live on dusrel.com
        if (target === '/' || target === '/hi/' || target === '/hi') continue;
        if (target.startsWith('/')) {
          const resolved = docLinkToFile(target);
          if (resolved === null) continue; // not a doc-page path (e.g. a site root page)
          if (!existsSync(resolved)) {
            broken.push(`${path.relative(ROOT, file)} -> ${raw}`);
          }
          continue;
        }
        // Relative link: resolve against the linking file's directory.
        if (target.endsWith('.md')) {
          const resolved = path.resolve(path.dirname(file), target);
          if (!existsSync(resolved)) broken.push(`${path.relative(ROOT, file)} -> ${raw}`);
        }
      }
    }
    expect(broken, `broken doc links:\n${broken.join('\n')}`).toEqual([]);
  });
});
