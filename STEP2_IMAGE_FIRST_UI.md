# BRAND ENGINE V13.5 — Step 2 Image-first UI

## Added
- `src/services/imageService.js`
  - Provider-independent image generation adapter
  - Local deterministic SVG mock generator
- `src/components/ImageToolbar.jsx`
  - Generate / regenerate / upload controls
- `src/components/ImageFirstSection.jsx`
  - Section image placeholder
  - Loading and failure states
  - Image upload
  - Text rendered as a separate overlay layer
  - Uses `visual`, `content`, and `design` from the Step 1 schema
- `src/App.jsx`
  - Final detail-page section preview now uses `ImageFirstSection`
  - Section visual changes are persisted through the existing section update/history flow

## Behavior
- No image: placeholder + exact HTML text layer
- Generate image: mock image is created locally and stored in `section.visual.imageUrl`
- Regenerate image: only the visual layer changes
- Upload image: user image is converted to a data URL and stored in the same visual field
- Existing text editor and project save/load structure remain intact

## API replacement point
Replace the body of `generateSectionImage()` in `src/services/imageService.js` with the real image API call. No UI component changes are required.

## Verification
- `npm install`: completed
- `npm run build`: completed successfully
- Vite transformed 1537 modules and produced `dist/`
