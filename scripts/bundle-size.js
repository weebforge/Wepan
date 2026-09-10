const fs = require("fs");
const path = require("path");

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

for (const file of walk("panel/dist")) {
  const buf = fs.readFileSync(file);
  console.log(`${file}: ${(buf.length / 1024).toFixed(1)}kb`);
}
