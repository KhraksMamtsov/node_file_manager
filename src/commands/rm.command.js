import p from "node:path";
import fsP from "node:fs/promises";

export const rmCommand = {
  name: "rm",
  description: "Delete file.",
  args: ["path_to_file"],
  run: async (args) => {
    const [additionalPath] = args;
    const path = p.resolve(process.cwd(), p.normalize(additionalPath));

    await fsP.rm(path);
  },
};
