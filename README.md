# Color Cosmetics

A responsive color management workspace for the cosmetics industry, built with React, TypeScript, Vite, and CSS. This initial version provides the application shell and sample pages; it uses local mock data and does not require a backend or credentials.

## Development

Requires Node.js 22 or later and npm.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

The development server binds to all interfaces. For production hosting, configure an SPA fallback to `index.html` so direct navigation to routes works.

## Structure

- `src/layouts`: shared navigation and application frame
- `src/pages`: dashboard, projects, color library, reports, and profile
- `src/components`: reusable presentation components
- `src/data`: local mock records, replaceable by an API layer
- `src/types`: shared domain types

All records and profile information are demonstrations. The dashboard and Projects section share locally persisted application state. Projects support a searchable, status-filtered grid, detail routes (`/projects/:projectId`), and create/edit forms for company, description, product type, members, and status (Development, Review, Approved, Production). Creation dates are retained when editing and update dates are refreshed. Associated colors are prominently displayed on each detail page. Dashboard color creation updates project palettes and activity across navigation. The Color Library uses the same shared records, scoped by company, with name/ID/HEX search, combined product/supplier/formula/project/approval filters, and supplier/formula sorting. Color records include product type, supplier, formula, and revision; RGB is derived from HEX. Add Color supports a visual picker, HEX (3 or 6 digits), RGB channels, unique internal IDs, company and optional project selection. Picker, HEX, and RGB inputs stay synchronized. Color cards link to `/colors/:colorId` detail pages with factory and reference data, formulation variations (lipstick, lip gloss, powder, cream), illustrated SVG reference images, lab notes, and revision history. These are explicitly mock development records; new colors start with revision 1 and empty study, image, and note sections. Add Color also records the manufacturing factory. Each color now has stored revision snapshots in the shared local state. The oldest-to-newest timeline includes author/date, supplier, factory, formula, HEX/RGB, notes, and approval. Two distinct revisions can be compared with changed fields highlighted. Create Revision appends an immutable snapshot, updates the current color and associated project/activity, and defaults approval to In development. Approval belongs to each revision; previous records stay unchanged. Newly added colors receive revision 1 automatically. Workspace state persists in this browser. Reports generate printable project snapshots, and Profile displays the current simulated identity. Supplier aliases, authentication, and server-side persistence remain deferred. Color Library search is local only. Typography uses a system font stack with no external font requests. No screen color measurement or manufacturing accuracy is implied by these sample swatches.

## Local reference image storage

Color details support selecting JPEG, PNG, and WebP images (up to 10 MB and 40 megapixels each, 8 per batch). Add a description and an existing revision for each image, then save. The gallery supports revision filters, full-size previews, and confirmed deletion. Images and revision snapshots are stored as blobs in IndexedDB; workspace colors, projects, revisions, and activity now persist in localStorage so attachments to newly created references remain reachable after reload. Browser storage failures are surfaced without discarding unsaved selections. Nothing is uploaded to a server. Clearing site data removes this local workspace and its images; other browsers/devices do not share the files.

## Simulated users and permissions

Use the Demo user selector in the header to switch between Alex Morgan (Administrator), Maya Patel (Developer), and Sofia Chen (Viewer). Administrator permissions include project/user management, color work, color approval, and print/PDF export from Reports. Developers can create/edit colors, add revisions, upload/remove images, and add notes. Viewers can browse projects, colors, revision comparisons, image previews, and reports. Color edits append revisions; only Administrators may mark a color/revision Approved. Action hooks also guard mutations, and switching identities closes pending forms. Project Team shows member roles and permissions; Administrators can add existing workspace users. The Profile page shows the active identity and capabilities, plus Administrator controls for adding demo users and assigning roles. Users/roles and the active simulated identity persist in localStorage. Notes record the current user and revision and persist locally. This is a client-side demonstration, not authentication or a security boundary; a future backend must enforce authorization.

## Project reports

Reports generates a snapshot of a selected project and all its associated colors. Options control company, product category, project status, team, swatches, IDs, formulas, suppliers, factories, revision numbers, approval statuses, and HEX/RGB values. After changing options or project data, regenerate the report before export. Administrators can use Export / Save as PDF to open the browser print dialog; choose Save as PDF and disable browser headers/footers. Print styles use A4 portrait, preserve swatch colors, hide application controls, and keep each color specification together across pages. All roles can generate and view reports; export follows the Administrator permission. Reports use mock development data and do not imply physical color approval.

## Presentation system and review

`src/design-system.css` defines shared type, color, radius, surface, focus, and spacing treatments across the application; component geometry and print layouts remain in `src/styles.css`. Keep future presentation changes aligned with these tokens. Navigation includes linked breadcrumbs, keyboard-accessible mobile controls, and a skip-to-content link. The dashboard links to collection and color details, and empty states describe the next available action. Old placeholder data/components have been removed so active pages share the same workspace records. The polish review covered all primary and missing-record routes, desktop/tablet/mobile sizes, modal forms, the project-to-report workflow, role restrictions, image persistence and storage errors, and printable reports.
