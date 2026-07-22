# Step 1 — Image-first Section Data Structure

## Applied
- Added `src/utils/sectionSchema.js`
- Every generated/saved/loaded section is normalized with:
  - `id`
  - `schemaVersion`
  - `content`
  - `visual`
  - `design`
- Existing fields such as `title`, `body`, `items`, `type`, and `intent` remain untouched for backward compatibility.
- Existing saved projects are normalized automatically when loaded.
- New projects are normalized before being stored.
- V9 mock renderer output and Claude generation output are normalized before entering the editor.

## Validation
- `npm run build` passed successfully.

## Next step
- Build a new Section Renderer that reads `visual`, `content`, and `design` separately.
