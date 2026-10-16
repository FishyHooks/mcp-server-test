import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ROOT, safePath } from "./sandbox.js";

const run = promisify(execFile);
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function git(args: string[]) {
  const { stdout, stderr } = await run("git", args, { cwd: ROOT });
  return (stdout + stderr).trim() || "(no output)";
}

export function createServer() {
  const server = new McpServer({ name: "my-mcp-server", version: "1.0.0" });

  server.registerTool(
    "list_files",
    {
      description: "List files and folders inside a workspace folder. Folders end with /.",
      inputSchema: { dir: z.string().default(".").describe("Folder path inside the workspace") },
    },
    async ({ dir }) => {
      const entries = await fs.readdir(safePath(dir), { withFileTypes: true });
      const lines = entries.map((e) => (e.isDirectory() ? e.name + "/" : e.name));
      return text(lines.join("\n") || "(empty)");
    }
  );

  server.registerTool(
    "read_file",
    {
      description: "Read a text file from the workspace.",
      inputSchema: { path: z.string().describe("File path inside the workspace") },
    },
    async ({ path: p }) => text(await fs.readFile(safePath(p), "utf8"))
  );

  server.registerTool(
    "write_file",
    {
      description:
        "Create a file or replace it fully. Makes folders if needed. Refuses to wipe a non-empty file with empty content.",
      inputSchema: {
        path: z.string().describe("File path inside the workspace"),
        content: z.string().describe("Full new file content"),
      },
    },
    async ({ path: p, content }) => {
      const full = safePath(p);
      try {
        const old = await fs.readFile(full, "utf8");
        if (old.length > 0 && content.trim().length === 0) {
          throw new Error("Refused: this would wipe a non-empty file with empty content.");
        }
      } catch (err: any) {
        if (err.code !== "ENOENT") throw err;
      }
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, content, "utf8");
      return text(`Wrote ${content.length} characters to ${p}`);
    }
  );

  server.registerTool(
    "str_replace",
    {
      description:
        "Swap one piece of text in a file for new text. old_str must appear exactly once in the file.",
      inputSchema: {
        path: z.string().describe("File path inside the workspace"),
        old_str: z.string().describe("Exact text to find (must be unique)"),
        new_str: z.string().describe("Text to put in its place"),
      },
    },
    async ({ path: p, old_str, new_str }) => {
      const full = safePath(p);
      const data = await fs.readFile(full, "utf8");
      const count = data.split(old_str).length - 1;
      if (count !== 1) throw new Error(`old_str found ${count} times. It must be found exactly 1 time.`);
      await fs.writeFile(full, data.replace(old_str, () => new_str), "utf8");
      return text(`Replaced 1 match in ${p}`);
    }
  );

  server.registerTool(
    "delete_file",
    {
      description: "Delete one file from the workspace. Does not delete folders.",
      inputSchema: { path: z.string().describe("File path inside the workspace") },
    },
    async ({ path: p }) => {
      await fs.rm(safePath(p));
      return text(`Deleted ${p}`);
    }
  );

  server.registerTool(
    "search_files",
    {
      description: "Search all workspace files for a piece of text. Returns file:line: text, max 50 results.",
      inputSchema: { query: z.string().describe("Text to look for") },
    },
    async ({ query }) => {
      const results: string[] = [];
      for (const file of await walk(ROOT)) {
        let data: string;
        try {
          data = await fs.readFile(file, "utf8");
        } catch {
          continue;
        }
        data.split("\n").forEach((line, i) => {
          if (results.length < 50 && line.includes(query)) {
            results.push(`${path.relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
          }
        });
      }
      return text(results.join("\n") || "No matches.");
    }
  );

  server.registerTool(
    "git_status",
    { description: "Show which workspace files changed (git status).", inputSchema: {} },
    async () => text(await git(["status", "--short", "--branch"]))
  );

  server.registerTool(
    "git_commit",
    {
      description: "Save all workspace changes as one git commit.",
      inputSchema: { message: z.string().min(3).describe("Short commit message") },
    },
    async ({ message }) => {
      await git(["add", "-A"]);
      return text(await git(["commit", "-m", message]));
    }
  );

  server.registerTool(
    "git_log",
    {
      description: "Show the last commits in the workspace.",
      inputSchema: { count: z.number().int().min(1).max(50).default(10) },
    },
    async ({ count }) => text(await git(["log", "--oneline", `-n`, String(count)]))
  );

  return server;
}