const fs = require("fs");
for (const dir of ["dist", "panel/dist", "docs"]) {
  fs.rmSync(dir, { recursive: true, force: true });
}
