// news-image-20261122 entry (Node 22, standard library only).
// The image is the entry.png beside this file; the program copies it to
// /output/entry.png (or $MAKEFUN_OUTPUT_DIR when set, for local runs).
// entry.png is a 1024x1024 PNG under the 1 MiB cap.
// The grader runs it twice; the copy is byte-identical both times.

import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const src = new URL("./entry.png", import.meta.url);
const dest = join(outDir, "entry.png");

// Fail loudly instead of copying a bad file: the source must be a real PNG.
const header = readFileSync(src).subarray(0, 8);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!header.equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG file");
}
copyFileSync(src, dest);

// Guard against a truncated copy: the grader runs this twice and the
// output must be byte-identical to the source both times.
if (statSync(dest).size !== statSync(src).size) {
  throw new Error("entry.png copy is incomplete");
}

