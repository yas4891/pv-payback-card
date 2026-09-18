import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const tag = process.argv[2];
if (!tag || !/^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(tag)) {
  throw new Error("Pass a release tag, for example: npm run release:check -- v0.4.3");
}

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const packageLock = JSON.parse(readFileSync(resolve(root, "package-lock.json"), "utf8"));
const expectedVersion = tag.slice(1);
const rootLockVersion = packageLock.version;
const packageEntryLockVersion = packageLock.packages?.[""]?.version;

if (
  packageJson.version !== expectedVersion ||
  rootLockVersion !== expectedVersion ||
  packageEntryLockVersion !== expectedVersion
) {
  throw new Error(
    `Version mismatch: tag=${tag}, package.json=${packageJson.version}, package-lock.json=${rootLockVersion}, packages[\"\"].version=${packageEntryLockVersion}`,
  );
}

const bundle = resolve(root, "dist", "pv-payback-card.js");
if (!existsSync(bundle))
  throw new Error("Missing dist/pv-payback-card.js. Run the release build first.");

try {
  execFileSync("git", ["diff", "--exit-code", "--", "dist/pv-payback-card.js"], {
    cwd: root,
    stdio: "ignore",
  });
} catch {
  throw new Error("dist/pv-payback-card.js differs from Git after the release build.");
}

console.log(`Release consistency check passed for ${tag}.`);
