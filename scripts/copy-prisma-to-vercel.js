// scripts/copy-prisma-to-vercel.js
const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "..", "node_modules", ".prisma");
const vercelFnsDir = path.resolve(
  __dirname,
  "..",
  ".vercel",
  "output",
  "functions"
);

if (!fs.existsSync(src)) {
  console.error("Source .prisma not found at", src);
  process.exit(0); // nothing to copy when building locally dev
}

// Find every function node entry and copy .prisma into its node_modules
if (fs.existsSync(vercelFnsDir)) {
  const fnNames = fs.readdirSync(vercelFnsDir);
  for (const fnName of fnNames) {
    const nodeDir = path.join(vercelFnsDir, fnName, "node");
    if (fs.existsSync(nodeDir)) {
      const targetNodeModules = path.join(nodeDir, "node_modules");
      try {
        fs.mkdirSync(targetNodeModules, { recursive: true });
        // copy directory recursively
        const copyRecursive = (srcDir, destDir) => {
          if (!fs.existsSync(destDir))
            fs.mkdirSync(destDir, { recursive: true });
          const entries = fs.readdirSync(srcDir, { withFileTypes: true });
          for (const entry of entries) {
            const srcPath = path.join(srcDir, entry.name);
            const destPath = path.join(destDir, entry.name);
            if (entry.isDirectory()) {
              copyRecursive(srcPath, destPath);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        };
        copyRecursive(src, path.join(targetNodeModules, ".prisma"));
        console.log(
          "Copied .prisma to",
          path.join(targetNodeModules, ".prisma")
        );
      } catch (e) {
        console.error("Failed to copy to", nodeDir, e);
      }
    }
  }
} else {
  // For older flow where functions may be under .vercel/output/functions/<name>/function
  const altFns = path.resolve(
    __dirname,
    "..",
    ".vercel",
    "output",
    "functions"
  );
  if (fs.existsSync(altFns)) {
    // same logic (already covered) — kept for clarity
  } else {
    console.log(
      ".vercel/output/functions not found; skipping copy (this is fine for non-vercel local builds)"
    );
  }
}
