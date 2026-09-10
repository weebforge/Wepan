const esbuild = require("esbuild");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const isWatch = process.argv.includes("--watch");

const entryPoints = [
  { in: "panel/index.ts", out: "index" },
  { in: "panel/scripts/tabs/home.ts", out: "tabs/home" },
  { in: "panel/scripts/tabs/files.ts", out: "tabs/files" },
  { in: "panel/scripts/tabs/db.ts", out: "tabs/db" },
  { in: "panel/scripts/tabs/analytics.ts", out: "tabs/analytics" },
  { in: "panel/scripts/tabs/guilds.ts", out: "tabs/guilds" },
  { in: "panel/scripts/tabs/message-builder.ts", out: "tabs/message-builder" },
  { in: "panel/scripts/tabs/users.ts", out: "tabs/users" },
];

const buildOptions = {
  entryPoints,
  bundle: true,
  outdir: "panel/dist",
  sourcemap: true,
  minify: !isWatch,
};

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else if (entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

function uglifyDist() {
  for (const file of walk("panel/dist")) {
    execSync(`uglifyjs "${file}" -c -m --toplevel -o "${file}"`, {
      stdio: "inherit",
    });
  }

  // wrap (() => {...})()
  for (const file of walk("panel/dist")) {
    const code = fs.readFileSync(file, "utf8");
    fs.writeFileSync(
      file,
      `// WeebForge is cool, isnt it?\n(() => {${code}})();`,
    );
  }
}

async function run() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log(`esbuild watching ${entryPoints.map((e) => e.in).join(", ")}`);
  } else {
    await esbuild.build(buildOptions);
    uglifyDist();
    console.log("build:js done.");

    require("./bundle-size");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
