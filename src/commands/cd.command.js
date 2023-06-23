import p from "node:path";
import fsP from "node:fs/promises";

export const cdCommand = {
  name: "cd",
  description:
    "Go to dedicated folder from current directory (path_to_directory can be relative or absolute).",
  args: ["path_to_directory"],
  run: async (currentLocation, args) => {
    const [additionalPath] = args;
    const path = p.resolve(currentLocation, p.normalize(additionalPath));

    await fsP.access(path, fsP.constants.F_OK);

    return path;
  },
};
