   # Research Note — LowKeyDesign

   ## 1. Learner Problem

   Students preparing for software engineering interviews and coursework often struggle with **low-level design (LLD)**:

   - They can memorize class-diagram examples, but struggle to **reason about responsibilities, encapsulation, and extensibility** on new problems.
   - Practice is usually **passive** (watching solutions) rather than **active** (drawing a design and getting critique).
   - Feedback, when available, is **delayed** (mentor/TA) or **too generic** (“use SOLID”, “add a factory”) without evidence from the learner’s actual diagram.
   - Existing tools are fragmented:
   - whiteboards for drawing
   - blogs/videos for theory
   - LeetCode-style platforms for coding
   - almost nothing that closes the loop for LLD practice + scored feedback

   The result: learners under-practice design decisions that interviewers care about (cohesion, coupling, abstractions, edge cases), and over-focus on implementing a single “correct” reference solution.

   **Core problem LowKeyDesign targets:**  
   *Learners need a low-friction way to practice LLD visually and receive fast, structured, design-quality feedback tied to their own diagram.*

   ---

   ## 2. Existing Approaches / Tools Researched

   ### A. Interview prep content platforms
   Examples: Educative LLD courses, YouTube system/LLD walkthroughs, blog series (Parking Lot, BookMyShow, etc.).

   - **Strengths:** Strong explanations, curated problem sets, reference architectures.
   - **Gaps:** Mostly consumption. Little interactive submission + personalized critique of a student’s own class diagram.

   ### B. Diagramming tools
   Examples: Excalidraw, draw.io / diagrams.net, Lucidchart, Mermaid.

   - **Strengths:** Excellent for sketching UML quickly; flexible canvases.
   - **Gaps:** Not education platforms. No problem statements, no rubric scoring, no attempt history as learning reports.

   ### C. Coding interview platforms
   Examples: LeetCode, HackerRank, CodeSignal.

   - **Strengths:** Tight practice loop, instant automated grading, progress tracking.
   - **Gaps:** Optimized for algorithms/implementation, not for UML responsibilities and design trade-offs.

   ### D. Academic UML / modeling tools
   Examples: Visual Paradigm (education), StarUML, campus modeling assignments.

   - **Strengths:** Formal UML support, sometimes validation against metamodel rules.
   - **Gaps:** Heavyweight for interview-style practice; feedback is often syntactic (is this valid UML?) rather than pedagogical (is this a good LLD for the requirements?).

   ### E. Generative AI chat assistants
   Examples: ChatGPT / Gemini used ad hoc by students.

   - **Strengths:** Immediate answers; can critique pasted designs.
   - **Gaps:** Unstructured chat, inconsistent rubric, easy to invent missing classes, hard to track attempts as formal reports, and no first-class UML editor integrated with submission state.

   ---

   ## 3. Key Gaps

   Across tools researched, four gaps stood out:

   1. **No closed practice loop for LLD**  
      Draw → submit → score → revise is rare compared with coding platforms.

   2. **Feedback is either too formal or too vague**  
      Tools check UML validity or give generic advice, but rarely cite evidence from the learner’s actual classes/relationships.

   3. **Reference-solution bias**  
      Learners are often shown one “standard” Parking Lot / ATM design, which discourages equally valid alternatives.

   4. **Weak attempt memory as learning artifacts**  
      Sketches live in local files or chat history; learners cannot easily revisit scored reports over time.

   These gaps define the product opportunity: an LLD-specific practice product with visual design, submission persistence, and rubric-driven evaluation.

   ---

   ## 4. Product Direction

   LowKeyDesign positions itself as an **LLD practice gym**, not a general diagramming suite and not a coding judge.

   ### Direction for MVP
   - Problem catalog for common LLD interview topics
   - Visual class-diagram editor (classes/interfaces/enums + UML relationships)
   - Authenticated submissions stored in MongoDB before evaluation
   - Hybrid evaluation:
   - deterministic structural checks
   - AI rubric scoring via OpenRouter
   - Clear report UX (score, criteria, strengths, concerns, suggestions)
   - My Attempts history for revisiting reports

   ### Design principles
   - **Multiple valid solutions** are first-class
   - Feedback must be **evidence-based** from submitted design elements
   - Never lose a learner’s attempt if AI fails
   - Keep the tool lightweight enough for interview prep sessions (~20–60 minutes)

   ### Near-term evolution (post-MVP)
   - Better problem metadata and requirement checklists per problem
   - Attempt analytics (score trends across retries)
   - Stronger evaluation robustness across free/paid models
   - Optional mentor review overlay on top of AI reports
   - Exportable design + report for portfolios

   ### Non-goals (for now)
   - Full enterprise UML compliance tooling
   - Real-time multiplayer whiteboarding
   - Replacing human interviewers

   ---

   ## 5. Conclusion

   Learners already have places to read LLD solutions and places to draw diagrams. What they lack is a practice platform that treats LLD like deliberate practice: attempt, feedback, revise, track progress.

   LowKeyDesign’s direction is to fill that gap with a focused MVP—visual design practice + persistent submissions + rubric-aligned AI feedback—while remaining honest about the limits of automated evaluation and keeping human-learning usefulness as the primary metric.
