import { test } from "node:test";
import assert from "node:assert/strict";
import { problems, projects, experience } from "../scripts/content-schema.mjs";
import projectsData from "../src/data/projectsData.js";

test("every content file matches its schema", async () => {
  assert.deepEqual(await problems(), []);
});

test("a typo in a case study field is caught with its path", () => {
  const [first] = projectsData;
  const broken = [{ ...first, caseStudy: { ...first.caseStudy, sumary: first.caseStudy.summary } }];
  const { error } = projects.safeParse(broken);
  const paths = error.issues.map((issue) => issue.path.join("."));
  assert.ok(paths.includes("0.caseStudy"), paths.join(", "));
});

test("dates must read like the rest", () => {
  const job = { company: "A", role: "B", description: "C", duration: "2025 - now" };
  assert.equal(experience.safeParse([job]).success, false);
  assert.equal(experience.safeParse([{ ...job, duration: "July 2025 — Present" }]).success, true);
});
