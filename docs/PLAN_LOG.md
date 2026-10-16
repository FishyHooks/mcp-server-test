# PLAN_LOG

## Goal
Build a **letter calculator**: a single-file web app (`index.html`, no dependencies, no build step). Letters replace numbers (a=1 ... z=26, bijective base-26).

## Plan (updated for the letter calculator)
1. **Part 1:** UI shell and the **add** operation, with clear. DONE (CP1).
2. **Part 2:** Subtract, multiply, divide, divide-by-zero handling. DONE (CP2, built together with the letter-value change).
3. **Part 3:** Chained operations, backspace (the "delete" feature), keyboard input, and the "done" step (equals / finished result shown). DONE (CP2 and CP3).
   - Decimals: DROPPED, since values are whole letters.
4. **Part 4:** Polish: UI design, responsive layout, accessibility, number equivalents on screen, manual test pass.
   - UI design, responsive layout, focus states, aria labels, number equivalents: DONE (CP3).
   - Manual browser test: NOT DONE (no browser available in the workspace tools; logic reviewed by reading only).

## Notes
- The request for "the add-task feature" was read as the calculator's **add (addition)** operation. Still unconfirmed.
- The request to "finish the done and delete features" does not match any item literally named in the earlier plan. It was read as: **delete** = backspace key (removes the last typed letter), **done** = the equals step that completes a calculation and shows the finished result with its expression. Still unconfirmed.
- Each part ends with an update to PROJECT_STATE.md, a checkpoint in CHECKPOINTS.md, and a git commit.

## Status
- Parts 1 to 3: done
- Part 4: done except the manual browser test
