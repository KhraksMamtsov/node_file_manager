import p from "node:path";

export const cdCommand = {
  name: "cd",
  description:
    "Go to dedicated folder from current directory (path_to_directory can be relative or absolute).",
  args: ["path_to_directory"],
  run: async (args) => {
    const [additionalPath] = args;
    const path = p.resolve(process.cwd(), p.normalize(additionalPath));

    process.chdir(path);
  },
};
