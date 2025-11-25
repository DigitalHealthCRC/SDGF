# Framework Step Pages Evaluation

## Overview
This document evaluates how well each **Step page** (`app/steps/<n>/page.tsx`) represents the corresponding phase defined in:
- **The Framework.pdf** – textual description of the five (actually seven) steps.
- **`src/content/framework/end_to_end_flow.json`** – machine‑readable definition containing:
  - `phase` / `title`
  - `accountable` and `support_roles`
  - `decisions` (questions, options, actions)
  - `governance_intent`
  - `operational_evidence`

The goal is to surface gaps and propose concrete UI/UX improvements that make each step page a **faithful, interactive embodiment** of the framework.

---

## Evaluation Criteria
| Criterion | What to look for in the page | Why it matters |
|-----------|----------------------------|----------------|
| **Title & Description** | Matches `title` and `summary` from the JSON phase. | Guarantees users see the correct step name and purpose. |
| **Accountable / Support Roles** | Visible badge or label indicating DP, DR, DS, GC, etc. | Reinforces governance responsibilities. |
| **Decision Questions** | UI that presents each `question` with its `options` (radio buttons, toggles) and handles actions such as `pause`, `resume`, `terminate`. | Drives the decision‑making workflow defined by the framework. |
| **Governance Intent** | Textual hint or tooltip explaining the intent of the phase. | Helps users understand the why behind each activity. |
| **Operational Evidence** | Checklist or download links for required artefacts (e.g., "Signed initiation record"). | Ensures auditability and compliance. |
| **Resources / Appendices** | Links to the appropriate appendix PDFs (already partly present). | Provides quick access to supporting documentation. |
| **Progress & Navigation** | `StepProgress` component, navigation to next step only when all required actions are complete. | Prevents users from skipping mandatory work. |
| **Visual Consistency** | Consistent layout, colour palette, micro‑animations, and accessible markup. | Aligns with the premium UI standards of the project. |

---

## Step‑by‑Step Findings

### Step 1 – *Assess the Use Case* (`app/steps/1/page.tsx`)
| Aspect | Current Implementation | Gap / Issue |
|--------|----------------------|--------------|
| Title & Description | Uses `stepData.title` and `stepData.summary` from `step1.json`. | ✅ Matches JSON title. |
| Accountable / Support Roles | Not displayed anywhere on the page. | **Missing** – users cannot see that DP is accountable and DR supports. |
| Decision Questions | No UI for the two decision questions defined in `end_to_end_flow.json` (lawfulness & high‑risk data). | **Missing** – the core governance logic is absent. |
| Governance Intent | Not shown. | **Missing** – the intent text is omitted. |
| Operational Evidence | Only generic "Resources" section linking to appendices. | **Partial** – does not list required evidence such as "Appendix 4 Use Case Assessment". |
| Resources / Appendices | Links to Appendix 4, 5, and templates are present. | ✅ Good. |
| Progress & Navigation | "Mark Step Complete" button enabled only after checklist items are ticked. | ✅ Works, but should also require decision outcomes. |
| Visual Consistency | Uses Tailwind‑based layout, micro‑animations for modal. | ✅ Meets UI standards. |

**Improvement Ideas**
1. Add a **badge bar** at the top: `Accountable: DP | Support: DR`. Use colour‑coded tags.
2. Render the **decision questions** as a radio‑group with explanatory tooltips. Implement the `pause`/`resume` logic by showing a modal that guides the user to the relevant appendix (e.g., Appendix 9 for PIA).
3. Show the **Governance Intent** in a subtle info‑card beneath the title.
4. Include an **Evidence Checklist** that auto‑checks when the user uploads/downloads the required artefacts.
5. Disable the "Continue to Step 2" link until both decisions are answered and evidence checklist is complete.

---

### Step 2 – *Prepare Source Data* (`app/steps/2/page.tsx`)
| Aspect | Current Implementation | Gap / Issue |
|--------|----------------------|--------------|
| Title & Description | Matches JSON title via `step2.json`. | ✅ |
| Accountable / Support Roles | Not displayed. | **Missing** – DP accountable, DS & DR support. |
| Decision Questions | No decision UI (the JSON defines no explicit questions for this phase, but the framework expects a **data‑quality sign‑off**). | **Partial** – the page only presents checkboxes, no explicit governance decision flow. |
| Governance Intent | Not shown. | **Missing** – intent text is absent. |
| Operational Evidence | No explicit list of required artefacts (e.g., "Ownership confirmation", "Profiling report"). | **Missing** – evidence checklist should be present. |
| Resources / Appendices | Links to Appendix 10 and 6, plus dynamic appendix links. | ✅ |
| Progress & Navigation | Completion button gated by `allChecksComplete()`. | ✅ but does not enforce governance sign‑off. |
| Visual Consistency | Consistent with Step 1. | ✅ |

**Improvement Ideas**
1. Add **Accountable/Support tags** similar to Step 1.
2. Insert an **Info card** with the governance intent: *"Confirm source data quality and fitness for purpose before synthesis."*
3. Provide an **Evidence checklist** (e.g., "Ownership confirmation", "Profiling report", "Cross‑custodian agreements") that mirrors the `operational_evidence` array in the JSON.
4. Consider a **decision modal** that asks the user to certify data quality; on "No" show guidance to remediate (link to Appendix 6). This aligns with the framework’s risk‑management approach.
5. Only enable the navigation to Step 3 after the evidence checklist is fully satisfied.

---

### Steps 3‑7 (Not yet opened)
The remaining step pages (`app/steps/3` … `app/steps/7`) follow a similar pattern to Steps 1‑2. Based on the JSON, the expected additions are:
- **Accountable/Support role tags** for each phase.
- **Decision UI** for phases that contain `decisions` (e.g., Step 3 – *Generate Synthetic Data* has utility and privacy‑risk questions).
- **Governance Intent** cards.
- **Operational Evidence** checklists (e.g., model logs, utility metrics, re‑identification risk reports).
- **Conditional navigation** that respects `pause`, `resume`, and `terminate` actions.
- **Micro‑animations** for modal transitions to keep the premium feel.

---

## Consolidated Implementation Plan
> **Goal**: Align every step page with the authoritative framework definition, making the UI a living representation of governance, decisions, and evidence.

### 1. Data Layer
- Extend each `step<n>.json` to include the fields from `end_to_end_flow.json` (accountable, support_roles, decisions, governance_intent, operational_evidence).
- Create a utility `loadFrameworkPhase(phaseId)` that merges the static JSON with the UI data.

### 2. UI Components (new / updated)
| Component | Purpose |
|-----------|---------|
| `RoleBadgeBar` | Displays accountable and support role tags with colour coding (DP = blue, DR = green, DS = purple, GC = orange). |
| `DecisionPanel` | Dynamically renders each decision question, radio options, and handles `pause`/`resume` actions by showing a modal with guidance and a link to the relevant appendix. |
| `GovernanceIntentCard` | Small info‑card under the page title summarising the intent. |
| `EvidenceChecklist` | List of required artefacts with checkboxes; automatically checks when the user downloads the associated PDF. |
| `ProgressGuard` (HOC) | Wraps the page component and disables the "Continue" button until all required sections (decisions, evidence) are completed. |

### 3. Page Refactor Steps (per step)
1. **Import** the new components.
2. **Render** `RoleBadgeBar` at the top of the page.
3. **Render** `GovernanceIntentCard` beneath the title.
4. **If** `decisions` exist, render `DecisionPanel` before the main checklist.
5. **Render** `EvidenceChecklist` after the main checklist.
6. **Wrap** the page with `ProgressGuard` to control navigation.

### 4. Styling & Animations
- Use the existing design system (Tailwind) but add subtle **fade‑in** and **slide‑up** animations for modals (`transition-opacity`, `transform translate-y-2`).
- Apply **gradient borders** to role badges for a premium look.
- Ensure all interactive elements have **focus-visible** outlines for accessibility.

### 5. Verification Plan
- **Automated tests**: Render each step page in a Jest/React Testing Library environment and assert that:
  - Role badges appear with correct text.
  - DecisionPanel renders the correct number of questions.
  - Continue button is disabled until required checkboxes are ticked.
- **Manual QA**: Run `npm run dev`, navigate through the steps, verify that pause/resume modals correctly redirect to the appropriate appendix pages.
- **User Acceptance**: Ask a stakeholder to review the updated pages against the PDF and JSON definitions.

---

## Next Steps
1. **Create the new UI components** (`RoleBadgeBar`, `DecisionPanel`, `GovernanceIntentCard`, `EvidenceChecklist`, `ProgressGuard`).
2. **Update `step1.json` and `step2.json`** to include the missing fields.
3. **Refactor `app/steps/1/page.tsx` and `app/steps/2/page.tsx`** using the plan above.
4. **Iterate** for steps 3‑7 following the same pattern.
5. Run the verification plan and document results in `walkthrough.md`.

---

*Prepared by Antigravity – your agentic coding assistant.*
