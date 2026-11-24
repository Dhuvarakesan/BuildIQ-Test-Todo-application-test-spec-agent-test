# Architecture Requirements Document (ARD)

> Every material architecture decision or constraint has a stable ID that feature specifications can reference.

## Document Metadata

- **Product/Application:** Simple Todo Application
- **Document ID:** ARD-TODO
- **Version:** 0.2
- **Status:** Draft
- **Architecture Owner:** TBD
- **Contributors:** TBD
- **Last Updated:** 2026-11-24
- **Reference PRD:** `PRD.md`

---

## 1. Architecture Summary

The Simple Todo Application will be implemented as a frontend-only React web application built with Vite, React, TypeScript, and Tailwind CSS. The application will run entirely in the browser, with no backend API, no user accounts, and no server-side persistence. Todos will be stored using browser `localStorage` and will fall back to in-memory current-session state when browser storage is unavailable or fails.

The architecture is intentionally small and maintainable for a small business first release. Presentation, todo state orchestration, and browser storage access will be separated into React UI components, a todo state hook, and a storage adapter module. The app will be hosted as static assets on Netlify or Vercel, served over HTTPS, and released when the production build succeeds and PRD Must requirements pass manual product acceptance testing.

Key architecture drivers are simplicity, local-only data privacy, responsive usability, coherent red visual theming, and resilience to browser storage failures.

## 2. Architecture Drivers

- PRD-FR-001 — Users must be able to create todos with a required title and optional description.
- PRD-FR-002 — Todo creation must validate required title input and show an inline error.
- PRD-FR-003 — Users must be able to view all created todos in a list.
- PRD-FR-004 — Each new todo must default to and display a Not Complete status without in-app status changes.
- PRD-FR-005 — Todos must persist after refresh on the same device using browser `localStorage`.
- PRD-FR-006 — Storage failure must not crash or block current-session todo creation and viewing.
- PRD-NFR-001 — The UI must use a responsive single-column layout that works on common mobile and desktop widths.
- PRD-NFR-002 — Todo data must remain local to the browser and must not be transmitted to a backend service.
- PRD-NFR-003 — The UI must apply a coherent red theme across visible app chrome and interactive styling while keeping themed text and controls readable against their backgrounds.
- CON-001 — The implementation must use React only for the frontend application.
- CON-002 — The first release must not use a backend API or server-side persistence.
- CON-003 — Persistence must use browser `localStorage`, with in-memory fallback for storage failure.
- CON-004 — The first release is scoped for a small business context and should remain simple to build, test, and maintain.
- CON-005 — There is no fixed deadline; release occurs when Must-priority requirements pass acceptance testing.
- CON-006 — No specific accessibility standard is defined for the first release; red themed text and controls must remain readable against their backgrounds.

## 3. Architecture Principles

1. Keep the app frontend-only and avoid backend, account, synchronization, or collaboration dependencies.
2. Store user-entered todo data locally and avoid transmitting todo content to external systems.
3. Reuse established repository and platform patterns where appropriate.
4. Keep presentation, orchestration, domain, integration, and persistence concerns separated.
5. Prefer simple browser-native capabilities over additional dependencies unless they materially reduce implementation risk.
6. Degrade gracefully when browser storage is unavailable by preserving current-session functionality.

## 4. System Context

### 4.1 Actors

- PERSONA-001 Busy Individual — Creates todos, views todos, and refreshes the page on the same device.
- Browser Runtime — Executes the React app, provides DOM APIs, and exposes the Web Storage API.
- Static Hosting Platform — Serves built static assets over HTTPS.
- Developer — Builds, validates, and deploys the static frontend application.

### 4.2 External Systems

| ID | System | Purpose | Interface | Owner |
|---|---|---|---|---|
| EXT-001 | Browser Web Storage API | Persist todos locally on the same browser and device | Browser API | Browser vendor/user device |
| EXT-002 | Netlify or Vercel Static Hosting | Serve static frontend assets over HTTPS | HTTPS/static file hosting | Hosting provider and project maintainer |
| EXT-003 | Dependency Vulnerability Scanner | Check frontend dependencies for known vulnerabilities on an advisory basis | CLI/service | Project maintainer |

## 5. Technology Stack

| Layer | Technology | Version/Constraint | Rationale |
|---|---|---|---|
| Frontend | React with TypeScript | Latest stable React version at implementation time | Meets React-only constraint while adding type safety for todo and storage logic |
| Backend | None | Backend APIs and server-side persistence are out of scope | Required by PRD local-only privacy and no-backend constraints |
| Data | Browser `localStorage` with in-memory fallback | Browser Web Storage API; fallback state lives only for current session | Supports same-device persistence and graceful storage failure handling |
| Hosting | Netlify or Vercel static hosting | Static assets served over HTTPS | Simple small-business deployment model for a frontend-only app |
| Build Tooling | Vite | Version TBD at implementation time | Lightweight React build tooling suitable for static deployment |
| Styling | Tailwind CSS | Version TBD at implementation time; red theme values TBD | Supports responsive single-column UI and coherent red theme styling with low custom CSS overhead |
| Language | TypeScript | Version TBD at implementation time | Provides compile-time checks for todo entity, status, and storage contracts |

## 6. Logical Architecture

### 6.1 Components

#### COMP-001 — Todo App Shell

- **Responsibility:** Compose the single-screen application layout, apply the red visual theme, connect the creation form and todo list, and surface storage error state.
- **Inputs:** User interactions from COMP-002, todo state from COMP-004, storage warnings from COMP-005.
- **Outputs:** Rendered responsive themed application screen.
- **Dependencies:** COMP-002, COMP-003, COMP-004.
- **Repository Area:** `src/App.tsx`

#### COMP-002 — Todo Creation Form

- **Responsibility:** Capture todo title and optional description, validate required title input, and submit valid todo creation requests.
- **Inputs:** User-entered title and description.
- **Outputs:** Validated create-todo request or inline validation error.
- **Dependencies:** COMP-004 for create action.
- **Repository Area:** `src/components/TodoForm.tsx`

#### COMP-003 — Todo List Display

- **Responsibility:** Display all todos with title, optional description, and Not Complete status in a responsive single-column list.
- **Inputs:** Todo collection from COMP-004.
- **Outputs:** Rendered todo list.
- **Dependencies:** Todo entity model.
- **Repository Area:** `src/components/TodoList.tsx`

#### COMP-004 — Todo State Hook

- **Responsibility:** Own todo state orchestration, create todos with default Not Complete status, load initial todos, and coordinate persistence.
- **Inputs:** Create-todo requests from COMP-002 and loaded todos from COMP-005.
- **Outputs:** Todo collection, create action, validation state, and storage error state.
- **Dependencies:** COMP-005, DATA-001.
- **Repository Area:** `src/hooks/useTodos.ts`

#### COMP-005 — Local Storage Adapter

- **Responsibility:** Encapsulate browser `localStorage` reads/writes, serialize and deserialize todo data, detect failures, and expose an in-memory fallback path.
- **Inputs:** Todo collections to persist; browser storage availability.
- **Outputs:** Loaded todo collection, persistence success/failure result, storage error details suitable for user-facing non-blocking messaging.
- **Dependencies:** EXT-001, DATA-001.
- **Repository Area:** `src/storage/todoStorage.ts`

#### COMP-006 — Static Build and Deployment Artifact

- **Responsibility:** Produce static assets for hosting and deployment.
- **Inputs:** Source files, dependency manifest, Vite configuration.
- **Outputs:** Production static build artifact.
- **Dependencies:** Vite, TypeScript, React, Tailwind CSS.
- **Repository Area:** `dist/`

### 6.2 Data Flow

1. PERSONA-001 enters a title and optional description in COMP-002.
2. COMP-002 validates that the title is not empty; invalid input renders an inline error and stops submission.
3. COMP-002 sends a valid create-todo request to COMP-004.
4. COMP-004 creates DATA-001 with a generated client-side identifier, user-entered title, optional description, and Not Complete status.
5. COMP-004 updates in-memory React state and sends the full todo collection to COMP-005 for persistence.
6. COMP-005 writes the serialized todo collection to EXT-001 using `localStorage`.
7. If storage succeeds, COMP-003 renders the updated todo list from COMP-004 state.
8. If storage fails, COMP-005 reports failure, COMP-004 keeps current-session todos in memory, and COMP-001 renders a non-blocking storage error.
9. On page load, COMP-004 requests stored todos from COMP-005; COMP-005 reads from `localStorage` when available and returns an empty list or recoverable failure when unavailable.

## 7. Architecture Decisions

### ARD-DEC-001 — Frontend-Only React Static Application

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-003, PRD-FR-005, PRD-NFR-002

**Decision**

Implement the app as a static frontend-only React application with no backend API, no authentication service, and no server-side persistence.

**Rationale**

The PRD explicitly constrains the first release to React-only implementation, browser-local storage, and no backend data transmission. A static frontend minimizes cost, operational overhead, and implementation complexity for a small business first release.

**Consequences**

- The app is simple to build, host, and maintain.
- Todos are device/browser-local and are not synchronized across devices.
- Server-side audit logging, centralized analytics, and centralized backup are not available in the first release.

**Alternatives Considered**

- Backend API with database — Not selected because CON-002 and PRD-NFR-002 prohibit backend persistence for the first release.
- Next.js application — Not selected because the app has no server-rendering, routing, or backend requirements.

### ARD-DEC-002 — Vite, React, and TypeScript Project Setup

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-003, PRD-NFR-001

**Decision**

Use Vite with React and TypeScript, targeting the latest stable React version at implementation time.

**Rationale**

Vite provides lightweight static builds for frontend-only deployment, while TypeScript reduces defects in todo entity handling, storage serialization, and component contracts.

**Consequences**

- Developers need a TypeScript-capable React toolchain.
- Type and production build checks can catch common implementation errors before release.
- Version-specific framework behavior must be confirmed at implementation time because exact React and Vite versions are TBD.

**Alternatives Considered**

- Vite with plain JavaScript — Simpler, but less type safety for storage and data contracts.
- Create React App — Not selected because it is less preferred for new lightweight React apps.

### ARD-DEC-003 — Separate UI Components, State Hook, and Storage Adapter

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-003, PRD-FR-005, PRD-FR-006

**Decision**

Separate responsibilities into React UI components, a todo state hook, and a browser storage adapter module.

**Rationale**

This keeps presentation, orchestration, and persistence concerns separated without adding unnecessary frameworks. It also makes storage failure handling easier to reason about and manually validate.

**Consequences**

- The codebase remains small while avoiding an oversized single component.
- Storage behavior can be isolated from UI rendering.
- More files exist than a one-component prototype, but maintainability improves.

**Alternatives Considered**

- Single `App` component — Not selected because it mixes validation, storage, and rendering concerns.
- Global state library — Not selected because the app has simple local state and one screen.

### ARD-DEC-004 — Browser `localStorage` with In-Memory Fallback

- **Status:** Accepted
- **Related Requirements:** PRD-FR-005, PRD-FR-006, PRD-NFR-002

**Decision**

Use browser `localStorage` as the persistence mechanism and fall back to current-session in-memory state when storage is unavailable or fails.

**Rationale**

This directly satisfies same-device persistence without backend storage and preserves core create/view functionality during storage failure.

**Consequences**

- Todos persist after refresh only when `localStorage` is available and not cleared.
- In-memory fallback todos are lost when the session ends or the page reloads.
- The app must expose a clear non-blocking storage error to avoid misleading users.

**Alternatives Considered**

- IndexedDB — More capability than needed for a simple todo list.
- Backend database — Not allowed by PRD constraints.

### ARD-DEC-005 — Tailwind CSS Responsive Single-Column Red Themed UI

- **Status:** Accepted
- **Related Requirements:** PRD-NFR-001, PRD-NFR-003

**Decision**

Use Tailwind CSS to implement a user-friendly responsive single-column layout and coherent red visual theme across visible app chrome and interactive styling.

**Rationale**

Tailwind supports responsive styling directly in the component layer and is sufficient for the simple mobile/desktop layout required by the PRD. Tailwind can also apply a coherent red theme to the header, buttons, focus states, validation/error styling where appropriate, and accents without adding a heavier design system.

**Consequences**

- Styling remains consistent without introducing a heavier UI component framework.
- The build must include Tailwind configuration and CSS processing.
- Exact red theme color values remain TBD until product defines them.
- Themed text and controls must be manually checked for readability because no specific accessibility standard is defined.

**Alternatives Considered**

- Plain CSS or CSS Modules — Viable, but not selected by the architecture decision.
- Material UI — More dependency and design system weight than needed.

### ARD-DEC-006 — Static Hosting on Netlify or Vercel

- **Status:** Accepted
- **Related Requirements:** PRD-NFR-001, PRD-NFR-002

**Decision**

Deploy the static build to Netlify or Vercel and serve the app over HTTPS.

**Rationale**

Static hosting matches the frontend-only architecture and provides simple deployment and rollback options for a small business.

**Consequences**

- Hosting provider selection remains between Netlify and Vercel until implementation.
- Deployment can be manual or integrated with the selected static host.
- Rollback is performed by redeploying the last successful build.

**Alternatives Considered**

- Company-owned hosting — Not selected for the first release because it adds operational overhead.
- GitHub Pages — Viable, but Netlify/Vercel provide a more common static app workflow.

### ARD-DEC-007 — Build-Only Release-Blocking Automated Gate

- **Status:** Accepted
- **Related Requirements:** PRD-FR-001, PRD-FR-002, PRD-FR-003, PRD-FR-004, PRD-FR-005, PRD-FR-006, PRD-NFR-001, PRD-NFR-002, PRD-NFR-003

**Decision**

Require the production build to pass before release. Manual acceptance testing validates PRD acceptance criteria. Linting, automated tests, and dependency scan findings are not release-blocking unless the policy changes.

**Rationale**

The selected first-release quality gate is intentionally minimal: build must pass, while product acceptance testing confirms functional, responsive, and red theme requirements.

**Consequences**

- Release friction stays low for the simple first release.
- Defects that linting or automated tests would catch may escape until manual testing or user use.
- Security dependency scanning is advisory, so known vulnerabilities require manual judgment rather than an enforced blocking severity threshold.

**Alternatives Considered**

- Build, lint, unit tests, and security scan as blockers — Stronger assurance, but not selected for this release.
- No automated gate — Not selected because at least the build must pass.

## 8. API and Integration Architecture

### ARD-API-001 — Browser Todo Storage Interface

- **Type:** Browser Web API
- **Operation/Topic:** `localStorage.getItem`, `localStorage.setItem`
- **Provider:** EXT-001 Browser Web Storage API
- **Consumers:** COMP-005 Local Storage Adapter
- **Authentication:** None; browser-local access within the app origin
- **Versioning:** Storage schema version field in serialized todo payload; initial version `1`

**Request/Input Contract**

The storage adapter writes a JSON payload under an implementation-defined app-specific storage key. The payload contains a schema version and an array of todo records.

```json
{
  "version": 1,
  "todos": [
    {
      "id": "client-generated-string",
      "title": "string, required, non-empty after trimming",
      "description": "string, optional",
      "completed": false,
      "createdAt": "ISO-8601 string"
    }
  ]
}
```

**Response/Output Contract**

Reads return a parsed todo collection matching DATA-001. Missing storage key returns an empty todo collection. Invalid, unavailable, or inaccessible storage returns a recoverable storage failure result to COMP-004.

**Error Handling**

`localStorage` read, write, quota, parse, and access errors must be caught by COMP-005. The app must not crash. On failure, COMP-004 continues with in-memory current-session todos and COMP-001 displays a clear non-blocking storage error. No retry is required beyond the next normal save/read attempt. Todo creation is not idempotent across repeated form submissions unless the UI prevents duplicate submissions during a single submit event.

## 9. Data Architecture

### DATA-001 — Todo

- **Purpose:** Represent a user-created daily task for local viewing and same-device persistence.
- **System of Record:** Browser `localStorage` when available; in-memory React state during storage failure or current unsaved session state.
- **Classification:** Confidential
- **Retention:** Retained in browser `localStorage` until the user, browser, or site-data policy clears it; in-memory fallback retained only for the current session.
- **Key Relationships:** Created by PERSONA-001; displayed by COMP-003; persisted by COMP-005.

### Data Migration

- **Required:** No
- **Approach:** Not applicable for the first release because there is no prior app, backend data source, or existing persisted schema. Future schema changes should use the version field in ARD-API-001.

## 10. Security Architecture

### ARD-SEC-001 — Local-Only Todo Data Handling

- **Related Requirements:** PRD-NFR-002

The implementation must:

- Store todo data only in browser `localStorage` or in-memory current-session state.
- Serve the static application over HTTPS on the selected host.
- Avoid backend API calls for todo persistence or retrieval.
- Avoid remote telemetry that transmits todo content.
- Treat user-entered todo content as Confidential local data.
- Catch storage errors without exposing stack traces or sensitive implementation details in user-facing messages.

The implementation must not:

- Send todo title, description, completion status, or identifiers to a backend service.
- Add authentication, user accounts, sharing, or collaboration features in the first release.
- Store application secrets in frontend source code or frontend environment variables.
- Log todo content to remote services in the first release.

### Security Controls

- **Authentication:** None; the app is anonymous and local to the browser session/device.
- **Authorization:** None; no multi-user, role, or shared-resource access model exists in the first release.
- **Secrets Management:** No application secrets are required or allowed in the frontend app.
- **Encryption:** HTTPS in transit for static assets; no additional application-layer encryption for `localStorage`; browser/device controls govern local data at rest.
- **Audit Logging:** No audit logging in the first release because there is no backend, account model, or remote telemetry.
- **Dependency/CVE Scanning:** Dependency vulnerability scanning should be run on an advisory basis; no blocking severity threshold is defined for the first release.
- **SBOM:** Not required for the first release.

## 11. Reliability, Performance, and Scalability

### ARD-OPS-001 — Initial Page Load Performance

- **Target:** Initial page load completes in under 2 seconds on a typical broadband connection.
- **Validation Method:** Manual browser timing or host preview validation using production build assets on the selected static host or local static preview.

### ARD-OPS-002 — Create/View Interaction Performance

- **Target:** Todo create-and-render interaction completes in under 100 ms after the app is loaded for typical first-release todo list sizes.
- **Validation Method:** Manual browser performance observation or lightweight timing in development tools during acceptance testing.

### ARD-OPS-003 — User Flow Completion

- **Target:** A representative user can add and see a todo in under 30 seconds without instructions.
- **Validation Method:** Manual observation of the PRD create/view flow during product acceptance testing.

### ARD-OPS-004 — Storage Failure Resilience

- **Target:** Storage read/write failure does not crash the app and does not block creating and viewing todos during the current session.
- **Validation Method:** Manual acceptance test with browser storage disabled, mocked failure, quota failure, or development-tool simulation.

### ARD-OPS-005 — Responsive Layout Reliability

- **Target:** Create form and todo list remain usable without horizontal scrolling at representative mobile and desktop viewport widths.
- **Validation Method:** Manual responsive viewport testing in latest stable Chrome, Edge, Firefox, and Safari on mobile and desktop where available.

### ARD-OPS-006 — Scalability Scope

- **Target:** Support normal individual daily personal task usage on one device; no multi-user or cross-device scalability target is required for the first release.
- **Validation Method:** Manual acceptance testing with multiple locally created todos and page refresh validation.

### ARD-OPS-007 — Red Theme Readability

- **Target:** The red themed header, primary submit button, focus states, applicable validation/error styling, accents, text, and controls remain readable and visually distinguishable against their backgrounds at representative mobile and desktop viewport widths.
- **Validation Method:** Manual visual acceptance testing against PRD-NFR-003.

## 12. Observability

- **Logging:** Browser console errors may be used during development; production user-facing errors must be clear and non-blocking for storage failures.
- **Metrics:** No remote metrics or analytics are required for the first release; KPI-001 is measured through manual observation.
- **Tracing:** No distributed tracing is required because there is no backend or distributed transaction path.
- **Alerting:** No runtime alerting is required for the first release; static host deployment/build status may be used operationally.
- **Sensitive Data Restrictions:** Todo title, description, status, and identifiers must not be sent to remote telemetry or logged to external systems.

## 13. Deployment Architecture

- **Environments:** Local development and production static hosting. No staging environment is required for the first release.
- **Deployment Model:** Build static assets with Vite and deploy to Netlify or Vercel manually or through the selected host’s repository integration.
- **CI/CD:** Production build must pass before release; automated deployment may be provided by Netlify or Vercel if configured.
- **Configuration Management:** Minimal frontend configuration only; no app secrets. Hosting configuration may be managed in the static host UI.
- **Rollback:** Redeploy the last successful static build or use the hosting provider’s previous deploy rollback capability.
- **Infrastructure as Code:** No IaC is required for the first release; hosting configuration may be managed in the static host UI.

## 14. Testing Architecture

Required test levels:

- Unit tests — Not required for first release; manual acceptance testing is the selected policy.
- Integration tests — Not required for first release; storage interaction is validated manually.
- Contract tests — Not required because there is no backend API; local storage payload is defined by ARD-API-001 and validated manually.
- End-to-end tests — Not required as automated tests; PRD user journeys are validated manually.
- Security tests — Dependency vulnerability scanning should be run on an advisory basis; HTTPS hosting and local-only data behavior are manually verified.
- Performance tests, where applicable — Manual validation of ARD-OPS-001, ARD-OPS-002, and ARD-OPS-003.
- Visual theme tests, where applicable — Manual validation of ARD-OPS-007 and PRD-NFR-003.

Minimum quality expectations:

- **Coverage Threshold:** No automated coverage threshold for the first release; manual acceptance testing must cover all Must-priority PRD acceptance criteria.
- **Blocking Security Severity:** None defined for the first release; dependency scan findings are advisory unless release policy changes.
- **Required Build/Lint Checks:** Production build must pass; lint is not a release-blocking check for the first release.

## 15. Architecture Constraints

- ARC-CON-001 — The app must be implemented as a React frontend-only application.
- ARC-CON-002 — The app must not use backend APIs or server-side persistence for todo data.
- ARC-CON-003 — Todo persistence must use browser `localStorage` with current-session in-memory fallback on storage failure.
- ARC-CON-004 — Todo data must not be transmitted to a backend service during create or view flows.
- ARC-CON-005 — Newly created todos must default to Not Complete and the first-release UI must not provide status-change controls.
- ARC-CON-006 — Editing, deleting, filtering, search, user accounts, sharing, and collaboration are out of scope for the first release.
- ARC-CON-007 — The UI must use a responsive single-column layout for common mobile and desktop widths.
- ARC-CON-008 — Release requires successful production build and acceptance of Must-priority PRD requirements; there is no fixed delivery date.
- ARC-CON-009 — No specific accessibility standard is defined for the first release; red themed text and controls must remain readable against their backgrounds.
- ARC-CON-010 — The architecture must remain simple to build, test, and maintain for a small business context.
- ARC-CON-011 — Locally stored todos are classified as Confidential user-entered local data.
- ARC-CON-012 — No application secrets may be stored in frontend code or frontend runtime configuration.
- ARC-CON-013 — The UI must apply a coherent red theme across visible app chrome and interactive styling, including header, buttons, focus states, validation/error styling where appropriate, and accents.

## 16. Risks and Trade-offs

| ID | Risk/Trade-off | Impact | Mitigation |
|---|---|---|---|
| ARC-RISK-001 | `localStorage` may be unavailable, disabled, full, or cleared by the user/browser | Todos may not persist after refresh | Use in-memory fallback and show a clear non-blocking storage error |
| ARC-RISK-002 | Users may expect editing, deleting, or completion toggling | First-release functionality may feel incomplete | Keep excluded functionality explicit in PRD, support text, and acceptance scope |
| ARC-RISK-003 | Build-only automated gate provides limited defect prevention | UI, validation, or storage defects may be found late | Require manual acceptance testing across PRD user journeys and target browsers |
| ARC-RISK-004 | No remote telemetry or audit logging limits production visibility | Runtime issues may only be discovered through user report or manual testing | Use host deployment logs and manual validation; consider remote error tracking only in a future privacy-reviewed release |
| ARC-RISK-005 | Netlify versus Vercel selection remains unresolved | Deployment instructions and rollback details may vary | Treat host choice as an implementation-time decision within the approved static-hosting constraint |
| ARC-RISK-006 | No application-layer encryption for localStorage | Local todo confidentiality depends on browser/device protections | Avoid transmitting todo data, document local-only data behavior, and do not store secrets |
| ARC-RISK-007 | Exact red color values are not yet defined | Theme implementation may be inconsistent or require rework before visual acceptance | Track exact theme values as an open architecture question and validate the implemented red theme manually against PRD-NFR-003 |

## 17. Open Architecture Questions

| ID | Question | Owner | Status | Decision/Due Date |
|---|---|---|---|---|
| ARC-OQ-001 | Who is the named architecture owner for the ARD? | Project Sponsor | Open | TBD |
| ARC-OQ-002 | Who are the named ARD contributors? | Project Sponsor | Open | TBD |
| ARC-OQ-003 | Which exact versions of React, TypeScript, Vite, and Tailwind CSS will be used? | Engineering Lead | Open | TBD at implementation time |
| ARC-OQ-004 | Which static hosting provider will be selected: Netlify or Vercel? | Engineering Lead | Open | TBD at implementation time |
| ARC-OQ-005 | What is the exact production URL and deployment ownership model? | Engineering Lead | Open | TBD |
| ARC-OQ-006 | Who are the named Solution Architect, Security Reviewer, and Engineering Lead approvers? | Project Sponsor | Open | TBD |
| ARC-OQ-007 | What exact red theme color values should be used for the application theme? | Product Owner | Open | TBD |

## 18. Feature Mapping

| Feature | Relevant Components | Decision IDs | Interface IDs | Security IDs |
|---|---|---|---|---|
| FEAT-001 | COMP-001, COMP-002, COMP-004 | ARD-DEC-001, ARD-DEC-002, ARD-DEC-003, ARD-DEC-007 | ARD-API-001 | ARD-SEC-001 |
| FEAT-002 | COMP-001, COMP-003, COMP-004 | ARD-DEC-001, ARD-DEC-002, ARD-DEC-003, ARD-DEC-005, ARD-DEC-007 | ARD-API-001 | ARD-SEC-001 |
| FEAT-003 | COMP-004, COMP-005 | ARD-DEC-001, ARD-DEC-004, ARD-DEC-007 | ARD-API-001 | ARD-SEC-001 |
| FEAT-004 | COMP-001, COMP-002, COMP-003 | ARD-DEC-005, ARD-DEC-007 | N/A | N/A |

## 19. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Solution Architect | TBD | Pending | TBD |
| Security Reviewer | TBD | Pending | TBD |
| Engineering Lead | TBD | Pending | TBD |