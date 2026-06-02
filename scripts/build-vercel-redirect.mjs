import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputDir = join(process.cwd(), 'vercel-static');
const primaryUrl = process.env.RELAY_PRIMARY_URL || process.env.NEXT_PUBLIC_RELAY_PRIMARY_URL || process.env.RAILWAY_PUBLIC_URL || process.env.RAILWAY_PUBLIC_DOMAIN || '';
const normalizedUrl = primaryUrl && !/^https?:\/\//i.test(primaryUrl) ? `https://${primaryUrl}` : primaryUrl;
const safeUrl = JSON.stringify(normalizedUrl);

await mkdir(outputDir, { recursive: true });

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Relay</title>
    ${normalizedUrl ? `<meta http-equiv="refresh" content="0; url=${normalizedUrl}">` : ''}
    <style>
      :root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f9fafb; color: #111827; }
      main { width: min(92vw, 36rem); padding: 2rem; border-radius: 1rem; background: white; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12); text-align: center; }
      h1 { margin: 0 0 0.5rem; font-size: clamp(2rem, 7vw, 3rem); }
      p { color: #4b5563; line-height: 1.6; }
      a { display: inline-block; margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 0.5rem; background: #2563eb; color: white; text-decoration: none; font-weight: 700; }
      code { padding: 0.15rem 0.35rem; border-radius: 0.25rem; background: #e5e7eb; color: #111827; }
      @media (prefers-color-scheme: dark) { body { background: #030712; color: #f9fafb; } main { background: #111827; } p { color: #d1d5db; } code { background: #374151; color: #f9fafb; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Relay</h1>
      ${normalizedUrl ? `<p>Opening the live Railway app…</p><p><a href="${normalizedUrl}">Continue to Relay</a></p>` : `<p>This Vercel deployment is only a domain handoff for the Railway-hosted Relay app.</p><p>Set <code>RELAY_PRIMARY_URL</code> in Vercel to your Railway public URL, then redeploy.</p>`}
    </main>
    <script>
      const target = ${safeUrl};
      if (target) window.location.replace(target + window.location.pathname + window.location.search + window.location.hash);
    </script>
  </body>
</html>
`;

await writeFile(join(outputDir, 'index.html'), html);
console.log(normalizedUrl ? `Vercel redirect page points to ${normalizedUrl}` : 'Vercel redirect page built without RELAY_PRIMARY_URL; configure it in Vercel.');
