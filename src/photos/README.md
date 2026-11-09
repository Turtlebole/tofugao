# Photos

The images here were pulled from the public @tofugao Instagram grid, so they are small (about 480 px wide)
and some are cropped out of poster covers. They are stored as AVIF (about 56% smaller than the original JPEGs,
which are kept in `photos-original/` at the project root). Swap them for full-resolution exports from Jovan
(around 2000 px on the long edge) using the same file names, or add new files and reference them in
`src/data/projects.ts`.

To convert a new JPEG export to AVIF (needs Python with Pillow):

```
python -c "from PIL import Image; Image.open('in.jpg').convert('RGB').save('out.avif', 'AVIF', quality=60, speed=6)"
```

- `cover-*.avif` is the Instagram cover of each post, shown in the Index hover preview.
- The others are clean crops (no poster text) used in the Selected work grid.

When you replace a file, update its `width` / `height` in `src/data/projects.ts` so the layout doesn't jump while loading.
