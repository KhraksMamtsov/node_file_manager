import p from "node:path";

export const upCommand = {
  name: "up",
  description: "Go upper from current directory.",
  run: () => {
    const newPath = p.resolve(process.cwd(), "..");
    process.chdir(newPath);
  },
};
