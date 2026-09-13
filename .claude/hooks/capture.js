#!/usr/bin/env node
'use strict';
/**
 * Capture hook for the 8x assignment agent-log requirement.
 *
 * Wired from .claude/settings.json to four lifecycle events:
 *   - SessionStart    -> seed the current model for this session (best-effort)
 *   - PostModelSwitch -> update the tracked model when it changes mid-build
 *   - UserPromptSubmit -> append a PROMPT entry (verbatim prompt text)
 *   - Stop            -> append a RESPONSE entry (verbatim last_assistant_message)
 *
 * Design notes:
 *   - Never blocks the session: always exits 0, never writes to stdout
 *     (stdout on UserPromptSubmit/SessionStart/PostModelSwitch is injected
 *     into Claude's context, so silence is required), and swallows every
 *     internal error into a local error log instead of throwing.
 *   - Turn numbering uses a per-session counter file rather than scanning
 *     the log file's own text for "[LOG_ENTRY ... num=N]", because a
 *     captured prompt or response can itself legitimately *contain* that
 *     literal string (e.g. someone pasting this very spec) which would
 *     desync a text-scanning counter.
 *   - The model name isn't in the UserPromptSubmit/Stop payloads, and the
 *     docs warn the transcript file can lag the current turn, so the model
 *     is tracked out-of-band via SessionStart/PostModelSwitch into a small
 *     per-session state file, with a config-file default as fallback for
 *     the (very first) session that predates this hook's installation.
 */
const fs = require('fs');
const path = require('path');

function readStdinJSON() {
  try {
    const data = fs.readFileSync(0, 'utf8');
    if (!data || !data.trim()) return {};
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
}

function logsDir() {
  const dir = path.join(projectRoot(), '.agent-logs');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function stateDir() {
  const dir = path.join(projectRoot(), '.claude', 'hooks', '.state');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function loadConfig() {
  try {
    const raw = fs.readFileSync(path.join(projectRoot(), '.claude', 'hooks', 'config.json'), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { author: 'unknown', project: path.basename(projectRoot()), tool: 'claude-code', defaultModel: 'unknown' };
  }
}

function shortId(sessionId) {
  return (sessionId || 'unknownid').slice(0, 8);
}

function readState(sessionId, ext, fallback) {
  try {
    const v = fs.readFileSync(path.join(stateDir(), `${sessionId}.${ext}`), 'utf8').trim();
    return v || fallback;
  } catch (e) {
    return fallback;
  }
}

function writeState(sessionId, ext, value) {
  try {
    fs.writeFileSync(path.join(stateDir(), `${sessionId}.${ext}`), String(value), 'utf8');
  } catch (e) {
    // best-effort only
  }
}

function getModel(sessionId, cfg) {
  return readState(sessionId, 'model', cfg.defaultModel || 'unknown');
}

function findLogFile(sessionId) {
  const dir = logsDir();
  const suffix = `_${sessionId}.md`;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(suffix));
  if (files.length === 0) return null;
  files.sort();
  return path.join(dir, files[0]);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function fileStamp(iso) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}_${pad(d.getUTCHours())}-${pad(
    d.getUTCMinutes()
  )}-${pad(d.getUTCSeconds())}`;
}

function createLogFile(sessionId, nowISO, cfg, model) {
  const dateStr = nowISO.slice(0, 10);
  const fname = `${fileStamp(nowISO)}_${sessionId}.md`;
  const fpath = path.join(logsDir(), fname);
  const short = shortId(sessionId);
  const frontmatter =
    [
      '---',
      `session_id: ${sessionId}`,
      `date: ${dateStr}`,
      `author: ${cfg.author}`,
      `model: ${model}`,
      `tool: ${cfg.tool}`,
      `project: ${cfg.project}`,
      `total_exchanges: 0`,
      `first_prompt_time: ${nowISO}`,
      `last_prompt_time: ${nowISO}`,
      '---',
      '',
      `# Session Log - ${dateStr}`,
      '',
      `Session: \`${short}\` | Project: \`${cfg.project}\` | Author: \`${cfg.author}\``,
      '',
      '---',
      '',
      '',
    ].join('\n');
  fs.writeFileSync(fpath, frontmatter, 'utf8');
  return fpath;
}

function updateFrontmatter(fpath, updates) {
  const content = fs.readFileSync(fpath, 'utf8');
  const updated = content.replace(/^---\n([\s\S]*?)\n---/, (whole, fm) => {
    const lines = fm.split('\n').map((line) => {
      const key = line.slice(0, line.indexOf(':'));
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        return `${key}: ${updates[key]}`;
      }
      return line;
    });
    return '---\n' + lines.join('\n') + '\n---';
  });
  fs.writeFileSync(fpath, updated, 'utf8');
}

function appendEntry(fpath, type, num, sessionId, nowISO, model, text) {
  const short = shortId(sessionId);
  const block = `[LOG_ENTRY type=${type} num=${num} session=${short}]\ntimestamp: ${nowISO}\nmodel: ${model}\n\n${text}\n\n\n`;
  fs.appendFileSync(fpath, block, 'utf8');
}

function main() {
  const mode = process.argv[2];
  const input = readStdinJSON();
  const sessionId = input.session_id || 'unknown-session';
  const nowISO = new Date().toISOString();
  const cfg = loadConfig();

  if (mode === 'session-start') {
    if (input.model) writeState(sessionId, 'model', input.model);
    return;
  }

  if (mode === 'model-switch') {
    const toModel = input.to_model || input.toModel;
    if (toModel) writeState(sessionId, 'model', toModel);
    return;
  }

  if (mode === 'prompt') {
    const model = getModel(sessionId, cfg);
    let fpath = findLogFile(sessionId);
    if (!fpath) {
      fpath = createLogFile(sessionId, nowISO, cfg, model);
    }
    const num = parseInt(readState(sessionId, 'count', '0'), 10) + 1;
    writeState(sessionId, 'count', num);
    const promptText = typeof input.prompt === 'string' ? input.prompt : '';
    appendEntry(fpath, 'PROMPT', num, sessionId, nowISO, model, promptText);
    updateFrontmatter(fpath, { total_exchanges: num, last_prompt_time: nowISO });
    return;
  }

  if (mode === 'stop') {
    const model = getModel(sessionId, cfg);
    const fpath = findLogFile(sessionId);
    if (!fpath) return; // no matching prompt entry ever landed for this session; nothing to pair with
    const num = parseInt(readState(sessionId, 'count', '1'), 10);
    const text = typeof input.last_assistant_message === 'string' ? input.last_assistant_message : '';
    appendEntry(fpath, 'RESPONSE', num, sessionId, nowISO, model, text);
    return;
  }
}

try {
  main();
} catch (e) {
  try {
    fs.appendFileSync(
      path.join(stateDir(), 'errors.log'),
      `${new Date().toISOString()} ${process.argv[2]}: ${(e && e.stack) || e}\n`,
      'utf8'
    );
  } catch (_) {
    // nothing more we can do
  }
}
process.exit(0);
