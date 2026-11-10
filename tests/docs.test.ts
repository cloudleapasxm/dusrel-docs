import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Project root = parent of tests/
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS_DIR = path.join(ROOT, 'docs');
const CONFIG_PATH = path.join(DOCS_DIR, '.vitepress', 'config.mts');

const EXPECTED_SLUGS = [
  'getting-started-with-dusrel',
  'how-to-generate-a-strong-password',
  'how-to-generate-a-username',
  'how-to-count-words-and-characters',
  'how-to-create-a-qr-code',
  'how-to-calculate-your-exact-age',
  'how-to-check-password-strength',
  'how-to-resize-and-compress-images-with-shrinkit',
  'how-to-create-synced-lyrics-lrc-with-ricsline',
  'how-to-build-a-resume-with-resumeforge',
  'how-to-work-with-pdfs-using-pdf-tools',
  'dusrel-mail-preview',
  'dusrel-apps-overview',
  'privacy-on-device',
  'about-dusrel',
];

/** Parse the YAML frontmatter block at the top of a .md file (no dependencies). */
function parseFrontmatter(filePath: string): Record<string, string> {
  const text = readFileSync(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  expect(match, `${filePath} must start with a frontmatter block`).toBeTruthy();
  const out: Record<string, string> = {};
  for (const line of (match as RegExpMatchArray)[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    // Strip one layer of surrounding single or double quotes.
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    out[kv[1]] = value;
  }
  return out;
}

/** List .md files directly under a docs directory (no recursion). */
function listMd(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

/**
 * Extract sidebar `link:` values from the VitePress config text.
 * The sidebars are top-level `sidebarEn` / `sidebarHi` constants
 * (referenced from `themeConfig.sidebar`), so extract ONLY those two
 * array blocks — scanning the whole config would also catch the nav
 * links (e.g. the nav 'Guide' link duplicates a sidebar link) and
 * scanning from the first `sidebar:` property would miss every doc
 * link. Returns normalised doc-page paths (trailing slash / .html /
 * .md stripped).
 */
function extractSidebarLinks(configText: string): string[] {
  const links: string[] = [];
  for (const name of ['sidebarEn', 'sidebarHi']) {
    const start = configText.indexOf(`const ${name}`);
    expect(start, `config.mts must define ${name}`).toBeGreaterThanOrEqual(0);
    const end = configText.indexOf('\n]\n', start);
    expect(end, `${name} array must close`).toBeGreaterThan(0);
    const block = configText.slice(start, end);
    for (const m of block.matchAll(/link\s*:\s*['"`]([^'"`]+)['"`]/g)) {
      let link = m[1].trim();
      if (!link.startsWith('/')) continue; // external URL
      link = link.replace(/\.html$/, '').replace(/\.md$/, '').replace(/\/$/, '');
      if (link === '' || link === '/hi') continue;
      links.push(link);
    }
  }
  return links;
}

/** Map a sidebar link to the .md file it must resolve to, or null if malformed. */
function sidebarLinkToFile(link: string): string | null {
  if (link.startsWith('/hi/')) {
    const slug = link.slice('/hi/'.length);
    return slug.includes('/') ? null : path.join(DOCS_DIR, 'hi', `${slug}.md`);
  }
  const slug = link.slice(1);
  return slug.includes('/') ? null : path.join(DOCS_DIR, `${slug}.md`);
}

describe('docs sidebar (config.mts)', () => {
  it('config.mts exists', () => {
    expect(existsSync(CONFIG_PATH), 'docs/.vitepress/config.mts must exist').toBe(true);
  });

  it('(a) every sidebar link has a corresponding .md file', () => {
    const links = extractSidebarLinks(readFileSync(CONFIG_PATH, 'utf8'));
    expect(links.length, 'sidebar must contain doc links').toBeGreaterThan(0);
    const missing: string[] = [];
    for (const link of links) {
      const file = sidebarLinkToFile(link);
      if (!file || !existsSync(file)) missing.push(link);
    }
    expect(missing, `sidebar links with no .md file: ${missing.join(', ')}`).toEqual([]);
  });

  it('(b) every doc .md (except index pages) appears in the sidebar', () => {
    const links = extractSidebarLinks(readFileSync(CONFIG_PATH, 'utf8'));
    const linkedFiles = new Set(
      links.map((l) => sidebarLinkToFile(l)).filter((f): f is string => f !== null),
    );
    const missing: string[] = [];
    for (const file of listMd(DOCS_DIR)) {
      if (file === 'index.md') continue;
      const full = path.join(DOCS_DIR, file);
      if (!linkedFiles.has(full)) missing.push(file);
    }
    for (const file of listMd(path.join(DOCS_DIR, 'hi'))) {
      if (file === 'index.md') continue;
      const full = path.join(DOCS_DIR, 'hi', file);
      if (!linkedFiles.has(full)) missing.push(`hi/${file}`);
    }
    expect(missing, `docs with no sidebar link: ${missing.join(', ')}`).toEqual([]);
  });

  it('(e) no duplicate sidebar links', () => {
    const links = extractSidebarLinks(readFileSync(CONFIG_PATH, 'utf8'));
    const seen = new Set<string>();
    const dupes = links.filter((l) => (seen.has(l) ? true : !seen.add(l)));
    expect(dupes, `duplicate sidebar links: ${[...new Set(dupes)].join(', ')}`).toEqual([]);
  });

  it('landing pages exist', () => {
    expect(existsSync(path.join(DOCS_DIR, 'index.md')), 'docs/index.md must exist').toBe(true);
    expect(existsSync(path.join(DOCS_DIR, 'hi', 'index.md')), 'docs/hi/index.md must exist').toBe(
      true,
    );
  });
});

describe('docs frontmatter', () => {
  it('(c) every doc has a non-empty title and description', () => {
    const bad: string[] = [];
    const check = (filePath: string) => {
      const fm = parseFrontmatter(filePath);
      if (!fm.title?.trim() || !fm.description?.trim()) bad.push(filePath);
    };
    for (const file of listMd(DOCS_DIR)) check(path.join(DOCS_DIR, file));
    for (const file of listMd(path.join(DOCS_DIR, 'hi'))) check(path.join(DOCS_DIR, 'hi', file));
    expect(bad, `docs missing title/description: ${bad.join(', ')}`).toEqual([]);
  });
});

describe('EN/HI parity', () => {
  it('(d) every EN doc has a HI twin and vice versa', () => {
    const en = new Set(listMd(DOCS_DIR).filter((f) => f !== 'index.md'));
    const hi = new Set(listMd(path.join(DOCS_DIR, 'hi')).filter((f) => f !== 'index.md'));
    const missingHi = [...en].filter((f) => !hi.has(f));
    const missingEn = [...hi].filter((f) => !en.has(f));
    expect(missingHi, `EN docs with no HI twin: ${missingHi.join(', ')}`).toEqual([]);
    expect(missingEn, `HI docs with no EN twin: ${missingEn.join(', ')}`).toEqual([]);
  });

  it('all 15 expected slugs exist in both locales', () => {
    for (const slug of EXPECTED_SLUGS) {
      expect(existsSync(path.join(DOCS_DIR, `${slug}.md`)), `missing docs/${slug}.md`).toBe(true);
      expect(
        existsSync(path.join(DOCS_DIR, 'hi', `${slug}.md`)),
        `missing docs/hi/${slug}.md`,
      ).toBe(true);
    }
  });
});
