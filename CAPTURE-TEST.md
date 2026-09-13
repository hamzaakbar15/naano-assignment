# Capture Hook — Canary Evidence

Referenced from commit `b38ef4d` ("Add automatic agent-capture hooks (8x assignment
setup)"), which pointed here for canary evidence but didn't actually add this file.
This closes that gap using the real runs produced while verifying the hooks.

## What's being verified

`.claude/hooks/capture.js` (wired via `.claude/settings.json`) is supposed to:

1. Append a verbatim `PROMPT` entry to `.agent-logs/<timestamp>_<session>.md` on
   every `UserPromptSubmit`, creating the file (with frontmatter) on first use.
2. Append the matching `RESPONSE` entry on `Stop`.
3. Keep turn numbers correct per session via a counter **file**, not by scanning
   the log text for `[LOG_ENTRY ... num=N]` (a captured prompt/response can itself
   contain that literal string and desync a text-scanning counter).
4. Tag every entry with the model that was actually active for that turn, tracked
   out-of-band via `SessionStart` / `PostModelSwitch` (the `UserPromptSubmit`/`Stop`
   payloads carry no model field).

## 1. Real cross-session canary

Two separate Claude Code sessions on this repo each sent the same canary prompt:

```
CAPTURE TEST — 8x assignment, Hamza
```

**Session `782c44e7`** — [.agent-logs/2026-09-13_15-07-26_782c44e7-b26c-47d1-be9a-992a85378666.md](.agent-logs/2026-09-13_15-07-26_782c44e7-b26c-47d1-be9a-992a85378666.md)
Captured a full `PROMPT` → `RESPONSE` pair for turn 1 (`UserPromptSubmit` and `Stop`
both fired, correctly paired, verbatim text preserved).

**Session `361edcd8`** — [.agent-logs/2026-09-13_15-09-00_361edcd8-2a2e-4a23-a324-1ea3ff665342.md](.agent-logs/2026-09-13_15-09-00_361edcd8-2a2e-4a23-a324-1ea3ff665342.md)
Started from a clean session: got its own file and its own turn counter starting
at 1 (no collision with `782c44e7`'s counter or file), confirming per-session
isolation. Its turn-1 `RESPONSE` half completes automatically via the `Stop` hook
right as this reply finishes — check the file directly for the completed pair.

Together these confirm points 1–3 above under real Claude Code hook events.

## 2. Synthetic model-switch test (script logic)

Point 4 can't be fully exercised without a real mid-session `/model` switch (see
"Open item" below), but the hook script's own handling of the model-tracking
state was verified directly, sandboxed via `CLAUDE_PROJECT_DIR` so it never
touched this repo's real `.agent-logs`/`.state`:

```
session-start  {model: claude-opus-5}
prompt         "first prompt, before switch"
stop           "first reply, before switch"
model-switch   {to_model: claude-haiku-4-5-20251001}
prompt         "second prompt, after switch"
stop           "second reply, after switch"
```

Resulting log file:

```
[LOG_ENTRY type=PROMPT num=1 session=synth1]    model: claude-opus-5
[LOG_ENTRY type=RESPONSE num=1 session=synth1]  model: claude-opus-5
[LOG_ENTRY type=PROMPT num=2 session=synth1]    model: claude-haiku-4-5-20251001
[LOG_ENTRY type=RESPONSE num=2 session=synth1]  model: claude-haiku-4-5-20251001
```

Turn numbering incremented correctly (1, then 2) and every entry after the
switch reflects the new model while entries before it keep the old one —
matching the design goal. No entries in `.claude/hooks/.state/errors.log`
during any of this.

## Open item

Neither real session above ever wrote a `.claude/hooks/.state/<id>.model` file,
meaning `SessionStart` fired but its payload didn't carry a `model` field in
this Claude Code build (or it wasn't captured) — so both real log files show
`model: claude-sonnet-5` only because that's `config.json`'s `defaultModel`,
which happens to match. The out-of-band tracking in part 2 is proven correct
*given* a model field/switch event; it hasn't yet been proven that Claude Code
actually sends one. **To close this out**: run `/model` to switch models mid-session
here, send another prompt, and confirm (a) a `.state/<session>.model` file appears
and (b) the next log entry's `model:` line changes accordingly. If it doesn't,
`getModel()`'s config-default fallback will silently mask real model switches in
the shipped log.
