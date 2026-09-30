/**
 * Next.js rewrites `basePath` into `next/link` hrefs and its own asset URLs,
 * but NOT into plain string paths like the resume download in the content file.
 * Anything from `portfolio` that points at `/public` goes through here.
 *
 * `NEXT_PUBLIC_*` is inlined at build time, so this is correct on both the
 * server and the client.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath<T extends string | null | undefined>(href: T): T {
  if (!href || !href.startsWith("/")) return href;
  return `${basePath}${href}` as T;
}
