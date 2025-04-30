import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname } from "node:path";

const archMap = { x64: "x64", x86_64: "x64", arm64: "arm64", aarch64: "arm64" };
const arch = archMap[process.arch] || "x64";
const url = `https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-${arch}`;
const binDir = "./node_modules/.bin";
const dest = `${binDir}/tailwindcss`;

if (!existsSync(dest)) {
  console.log("Downloading Tailwind binary →", dest);
  mkdirSync(binDir, { recursive: true });
  execSync(`curl -sSL ${url} -o ${dest}`);
  chmodSync(dest, 0o755);
  console.log("✓ Tailwind binary ready");
}

