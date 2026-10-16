import { describe, it, expect } from "vitest";
import { safePath } from "../src/sandbox.js";

describe("sandbox", () => {
  it("allows a path inside the workspace", () => {
    expect(() => safePath("notes/a.txt")).not.toThrow();
  });
  it("blocks ../", () => {
    expect(() => safePath("../secret.txt")).toThrow();
  });
  it("blocks ../../etc/passwd", () => {
    expect(() => safePath("../../etc/passwd")).toThrow();
  });
  it("blocks a hidden escape in the middle", () => {
    expect(() => safePath("notes/../../secret.txt")).toThrow();
  });
  it("blocks an absolute path", () => {
    expect(() => safePath("/etc/passwd")).toThrow();
  });
});