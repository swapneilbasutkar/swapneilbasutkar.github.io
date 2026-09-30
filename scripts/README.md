# scripts/

## `opengraph-image.tsx`

The React source the social preview card was generated from.

The card itself ships as a committed PNG at `src/app/opengraph-image.png`. It is a
static file rather than a build-time route because a generated `opengraph-image`
route emits a file with **no extension**, which static hosts (GitHub Pages
included) serve as `application/octet-stream` — and social scrapers reject that.

To regenerate it after changing your name, descriptor or headline:

1. Copy this file into `src/app/opengraph-image.tsx` and delete
   `src/app/opengraph-image.png`.
2. Run `npm run dev` and save the rendered card:
   `curl -o src/app/opengraph-image.png http://localhost:3000/opengraph-image`
3. Delete `src/app/opengraph-image.tsx` again so the committed PNG is used.

Update `src/app/opengraph-image.alt.txt` to match.
