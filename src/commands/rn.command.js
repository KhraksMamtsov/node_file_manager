import p from "node:path";
import fsP from "node:fs/promises";
import { assertPathWithType } from "../assertPathWithType.js";

export const rnCommand = {
  name: "rn",
  description: "Rename file.",
  args: ["path_to_file", "new_filename"],
  run: async (args) => {
    const [additionalPath, newName] = args;
    const path = p.resolve(process.cwd(), p.normalize(additionalPath));
    const newPath = p.join(p.dirname(path), p.normalize(newName));

    await assertPathWithType({
      checkPath: path,
      type: "file",
    });

    await fsP.rename(path, newPath);
  },
};
