import p from "node:path";
import fsP from "node:fs/promises";

export const addCommand = {
  name: "add",
  description: "Create empty file in current working directory.",
  args: ["new_file_name"],
  run: async (currentLocation, args) => {
    const [filename] = args;
    const path = p.resolve(currentLocation, p.normalize(filename));
    await fsP.writeFile(path, "");
  },
};
