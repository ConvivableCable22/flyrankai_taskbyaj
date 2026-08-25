# AI Development Workflow Comparison

            ## Round 1 — Vague Prompt

            Round 1 used a deliberately vague prompt asking the AI to build a settings form with validation.
            The implementation worked for basic Profile validation, but manual testing exposed important behavioral issues. Saving Security or Notifications unexpectedly redirected to the Profile section and cleared the Profile fields. There were also no automated tests, so these issues had to be discovered manually. Review therefore required testing each section and its interactions without automated coverage.

            ## Round 2 — Precise Prompt

            Round 2 started independently from `main` using a fresh Claude session. The prompt specified the exact fields, validation rules, state-preservation requirements, accessibility constraints, implementation constraints, and a mandatory verification loop. Claude first produced a plan, then implemented the feature and added automated tests.

            The code structure was also more modular. `SettingsForm.jsx` changed from 590 deleted lines to 125 added lines, while separate `ProfileSection`, `SecuritySection`, and `NotificationsSection` components were introduced. Shared `FormField` and `ToggleField` components and a dedicated validation utility were also added. Most importantly, Round 2 added a 213-line test suite with 13 tests; Round 1 had no test files. All 13 Round 2 tests passed, and the production build also completed successfully.

            ## Review, Correctness, and Edge Cases

            The precise workflow required explicit handling of password mismatch, short passwords, invalid email addresses, digest values outside 1–30, default notification states, section persistence, and failed/successful submission behavior. This reduced the amount of manual review needed to establish confidence in correctness.

            One AI mistake caught during Round 1 was the unexpected navigation and state reset after saving Security or Notifications. Round 2 explicitly prevented this and added tests for the behavior.

            Although Round 2 required more upfront planning and specification, it produced stronger verification and less ambiguity during review. The key lesson is that AI output quality depends heavily on specifying behavior and verification, not simply asking the model to build a feature.

            ## Project Rules Learned

            1. Form submissions must remain in the active section and must not unexpectedly reset other section state.
            2. Every non-trivial form feature must include automated tests for validation, submission behavior, and cross-section state.
            3. Validation logic should be explicit and testable, with field-specific errors and defined edge-case boundaries.