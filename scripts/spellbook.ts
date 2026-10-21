#!/usr/bin/env node
import { resolve } from "node:path";
import { cli as install } from "./install.ts";
import { lint } from "./lint.ts";
import { cli as upstream } from "./upstream.ts";

const [command, ...args] = process.argv.slice(2);
if (command === "upstream") {
  await upstream(args).catch((error: Error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
} else if (command === "lint") {
  const problems = await lint(resolve(import.meta.dirname, ".."));
  console.log(problems.length ? problems.join("\n") : "No problems found.");
  if (problems.length) process.exitCode = 1;
} else {
  await install();
}
