# Design Note — LowKeyDesign MVP

## 1. MVP Summary

LowKeyDesign is a practice platform for **low-level design (LLD)**. Learners pick a problem, draw a UML class diagram in a visual editor, submit it, and receive structured feedback against a fixed design rubric.

The MVP focuses on one complete loop:

**Problem → Design → Submit → Evaluate → Report → Retry / Review attempts**

Out of scope for MVP: collaborative editing, production-grade plagiarism checks, custom problem authoring UI, and multi-model ensemble evaluation.

---

## 2. User Flow

1. **Register / Login**  
   User creates an account. Passwords are hashed with bcrypt. JWT is returned and stored by the frontend.

2. **Dashboard (Problems)**  
   Authenticated users browse practice problems (Parking Lot, Library, ATM, etc.).

3. **Start Practice**  
   Opens the UML editor for the selected problem.

4. **Design**  
   User adds classes, abstract classes, interfaces, and enums; connects them with UML relationships (inheritance, implementation, association, aggregation, composition, dependency).

5. **Submit Design**  
   User confirms submission. Frontend serializes React Flow `nodes` + `edges` and sends them to `POST /api/submissions` with JWT.

6. **Evaluation**  
   Backend stores the submission first, runs deterministic checks, then calls OpenRouter for AI scoring.

7. **Report**  
   Submission page polls until status is `completed` or `failed`, then shows score + criterion feedback.

8. **My Attempts**  
   User can reopen past submissions/reports and practice again.

---

## 3. Important Classes / Interfaces (System Design)

### Backend domain models

| Model | Responsibility |
|---|---|
| `User` | Account identity (`name`, `email`, hashed `password`) |
| `Submission` | One attempt: `user`, `problemId`, `design`, `status`, optional `evaluationError` |
| `Evaluation` | One report per submission: `overallScore`, `criteria[]`, `strengths`, `concerns`, `suggestions` |

### Design payload (from the editor)

- **Node types:** `classNode`, `abstractNode`, `interfaceNode`, `enumNode`
- **Node data:** `name`, `attributes[]`, `methods[]`, `enumValues[]`
- **Edges:** `source`, `target`, `relationshipType`

### Key backend modules

- `authController` — register/login/me
- `submissionController` — create, list attempts, get by id, retry evaluation
- `analyzeDesign` — deterministic validation findings
- `aiEvaluationService` — OpenRouter evaluation + JSON validation
- `evaluationService` — persist evaluation and update submission status

### Frontend building blocks

- `AuthContext` — session state (`token`, `user`, login/register/logout)
- `Editor` — React Flow canvas + relationships toolbar
- `Submission` — polling + report rendering
- `MyAttempts` — attempt history / report entry points

---

## 4. Evaluation Approach

Evaluation is intentionally **two-layered**.

### Layer A — Deterministic checks

Before AI scoring, the backend inspects the design for objective issues, such as:

- empty design
- counts of classes / interfaces / abstract classes / enums / relationships
- unnamed nodes
- duplicate names
- relationships pointing to missing nodes
- classes with no attributes or methods

These findings are passed to the AI as context, not as the final score.

### Layer B — Rubric-based AI evaluation (OpenRouter)

The AI scores the design using a fixed weighted rubric:

1. Requirement Understanding — 15%
2. Class Responsibilities — 20%
3. Encapsulation — 10%
4. Coupling & Cohesion — 15%
5. Abstraction — 10%
6. Extensibility — 10%
7. Design Patterns — 5%
8. Edge Cases — 5%
9. Explanation Quality — 10%

Rules enforced in prompting + backend validation:

- Multiple valid LLD solutions are allowed
- Do not force one reference solution
- Do not invent missing classes/methods/relationships
- Return structured JSON only
- Backend recalculates overall score from criterion scores

### Failure handling

If AI evaluation fails:

- the submission remains stored
- status becomes `failed`
- user can retry without creating a new submission

---

## 5. Key Trade-offs

| Decision | Trade-off |
|---|---|
| Visual editor over text UML | Faster for learners; harder to enforce formal UML completeness |
| Persist submission before AI | Safer (no lost work); requires async/retry UX |
| Deterministic checks + AI | Better grounding; still not as precise as human review |
| OpenRouter free models | Low cost; occasional malformed JSON / rate limits |
| Fixed rubric | Consistent feedback; less flexibility for niche problem styles |
| JWT in localStorage | Simple MVP auth; XSS risk higher than httpOnly cookies |
| Local draft save in browser | Good offline draft UX; not yet synced as server-side drafts |
| Problem catalog in code/data files | Fast MVP; not yet a CMS for educators |

---

## 6. MVP Success Criteria

- A learner can register, design, submit, and receive a report end-to-end
- Designs are never lost when AI evaluation fails
- Feedback is structured, rubric-aligned, and reviewable later under My Attempts
- Core auth, editor, submission, and report flows remain usable without redesigning the UI
