import fs from "fs";
import globModule from "glob";
import { promisify } from "util";
import { execaSync } from "execa";
import path from "path";

const glob = promisify(globModule.glob);

const NEW_VERSION = execaSync("node", ["--version"], {
  stdio: "pipe",
}).stdout.replace("v", "");

async function main() {
  const cwd = path.resolve(".");

  // Find all package.jsons, to update lockfiles and also see if this even is a JS repo
  const packageJsons = await glob("**/package.json", {
    cwd,
  });

  // Bail if this isn't a JS repo
  if (packageJsons.length === 0) {
    console.error("No JS in this repo");
    process.exit(2);
  }

  // Update lockfiles for the new npm version
  for (let packageJson of packageJsons) {
    const dir = path.resolve(cwd, packageJson, "..");

    execaSync("npm", ["install"], {
      cwd: dir,
    });
  }

  // Find any .node-version files
  const nodeVersions = await glob("**/.node-version", {
    cwd,
  });

  // Add a .node-version at the root if it doesn't exist
  nodeVersions.push(".node-version");

  // Update all node-version files to match the new version
  for (let nodeVersion of nodeVersions) {
    fs.writeFileSync(path.resolve(".", nodeVersion), NEW_VERSION);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
