# CHECKPOINTS

## CP1: Part 1 complete (2026-10-17)
- Wrote 4-part plan in PLAN_LOG.md.
- Built `index.html` with calculator UI and working addition (digits, `+`, `=`, `C`, chaining).
- Updated PROJECT_STATE.md.
- Verified: code reviewed by reading only; not run in a browser.
- Open question: "add-task feature" interpreted as the addition operation.
- Next: Part 2 (subtract, multiply, divide).

## CP2: Plan change to letter calculator + all four operations (2026-10-17)
- Plan changed: digits replaced by letters a-z (a=1 ... z=26), read as bijective base-26.
- Rebuilt `index.html`: 26 letter keys, `+`, `−`, `×`, `÷`, `=`, `C`; BigInt math; letter/number conversion helpers.
- Decisions: zero shown as `0`; negatives use `-` prefix; division is integer (truncated toward zero); divide by zero shows `Error`.
- Updated PROJECT_STATE.md. PLAN_LOG.md and DECISIONS.md left untouched.
- Verified: code reviewed by reading only; not run in a browser.
- Next: manual browser test, then backspace and keyboard input.

## CP3: UI design, number equivalents, delete/done, keyboard (2026-10-17)
- Redesigned `index.html`: card layout, screen panel, themed light/dark, accent operator keys, active-operator ring, key press feedback, responsive and reduced-motion rules.
- Added number equivalents on screen: decimal value of the display, per-letter breakdown (`a=1 · b=2`), expression line with `letters (number)`, and a small number label on every letter key.
- Finished delete (backspace key ⌫) and done (equals shows result plus full expression). Added keyboard input (a-z, `+ - * /`, Enter/`=`, Backspace/Delete, Escape).
- Updated PLAN_LOG.md (4-part plan rewritten for letters, statuses set), DECISIONS.md (D1-D8), PROJECT_STATE.md.
- Verified: code reviewed by reading only; not run in a browser (no browser tool in this workspace).
- Open questions: "add-task" and "done/delete" interpretations (see DECISIONS D4, D5).
- Next: manual browser test pass.
