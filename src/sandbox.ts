import path from "node:path";

export const ROOT = path.resolve(
  process.env.WORKSPACE_ROOT ?? path.join(process.cwd(), "workspace")
);

export function safePath(userPath: string): string {
  const full = path.resolve(ROOT, userPath);
  const rel = path.relative(ROOT, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Path escapes the workspace. Not allowed.");
  }
  return full;
}