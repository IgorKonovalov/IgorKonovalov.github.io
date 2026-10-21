/**
 * Serves the Jekyll-era URLs as real files that redirect to the Astro ones.
 *
 * Astro's own `redirects` option would do this, but under `build.format:
 * 'directory'` it writes `/old/path.html/index.html`, so GitHub Pages first
 * bounces `/old/path.html` to `/old/path.html/` and only then serves the
 * redirect: two hops where a search engine expects one. This integration
 * writes `/old/path.html` itself, after the build, and refuses to write a
 * redirect whose target the build did not produce.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { SITE_URL } from './seo';

function redirectPage(to: string): string {
  const href = `${SITE_URL}${to}`;
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>Redirecting to ${to}</title>`,
    `<meta http-equiv="refresh" content="0;url=${to}">`,
    `<link rel="canonical" href="${href}">`,
    '</head>',
    `<body><p>This page moved to <a href="${to}">${href}</a>.</p></body>`,
    '</html>',
    '',
  ].join('\n');
}

/** The built file a site path resolves to: a directory's index or a file. */
function builtFile(dist: string, sitePath: string): string {
  const rel = sitePath.endsWith('/') ? `${sitePath}index.html` : sitePath;
  return path.join(dist, rel);
}

export function legacyRedirects(
  redirects: Record<string, string>,
): AstroIntegration {
  return {
    name: 'legacy-redirects',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const missing = Object.entries(redirects).filter(
          ([, to]) => !existsSync(builtFile(dist, to)),
        );
        if (missing.length > 0) {
          throw new Error(
            'legacy redirects point at pages the build did not produce:\n' +
              missing.map(([from, to]) => `  ${from} -> ${to}`).join('\n'),
          );
        }
        for (const [from, to] of Object.entries(redirects)) {
          const file = path.join(dist, from);
          if (existsSync(file)) {
            throw new Error(
              `legacy redirect ${from} would overwrite a built page`,
            );
          }
          mkdirSync(path.dirname(file), { recursive: true });
          writeFileSync(file, redirectPage(to));
        }
        logger.info(`wrote ${Object.keys(redirects).length} legacy redirects`);
      },
    },
  };
}
