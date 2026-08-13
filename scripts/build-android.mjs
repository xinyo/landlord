import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const corepackEntrypoint = resolve(
  dirname(process.execPath),
  "node_modules/corepack/dist/corepack.js",
);
const corepackCommand = existsSync(corepackEntrypoint) ? process.execPath : "corepack";

function run(args, { capture = false, cwd = root } = {}) {
  return new Promise((resolvePromise, reject) => {
    const corepackArgs = existsSync(corepackEntrypoint)
      ? [corepackEntrypoint, "pnpm", ...args]
      : ["pnpm", ...args];
    const child = spawn(corepackCommand, corepackArgs, {
      cwd,
      env: process.env,
      shell: false,
      stdio: capture ? ["inherit", "pipe", "inherit"] : "inherit",
    });
    let output = "";
    if (capture) child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolvePromise(output);
      else reject(new Error(`Command failed with exit code ${code}`));
    });
  });
}

try {
  await run(["--filter", "@landlord/mobile", "typecheck"]);
  const output = await run([
    "dlx", "eas-cli", "build",
    "--platform", "android",
    "--profile", "apk",
    "--wait",
    "--non-interactive",
    "--json",
  ], { capture: true, cwd: resolve(root, "apps/mobile") });

  const parsed = JSON.parse(output.trim());
  const build = Array.isArray(parsed) ? parsed[0] : parsed;
  const artifactUrl = build?.artifacts?.buildUrl ?? build?.artifacts?.applicationArchiveUrl;
  if (!artifactUrl) throw new Error("EAS completed without an APK artifact URL");

  const response = await fetch(artifactUrl);
  if (!response.ok) throw new Error(`APK download failed: HTTP ${response.status}`);
  const directory = resolve(root, "dist-android");
  const target = resolve(directory, "landlord.apk");
  const temporary = resolve(directory, `landlord-${process.pid}.tmp`);
  await mkdir(directory, { recursive: true });
  await writeFile(temporary, Buffer.from(await response.arrayBuffer()));
  await rm(target, { force: true });
  await rename(temporary, target);
  console.log(`APK downloaded to ${target}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error("If EAS is not linked or signing is not configured, run: pnpm android:setup");
  process.exitCode = 1;
}
