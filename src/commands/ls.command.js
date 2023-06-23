import fsP from "node:fs/promises";
import { cyan } from "../console.js";

export const lsCommand = {
  name: "ls",
  description:
    "Print in console list of all files and folders in current directory.",
  run: async () => {
    const dirents = (
      await fsP.readdir(process.cwd(), {
        withFileTypes: true,
      })
    ).reduce(
      (acc, dirent) => {
        if (dirent.isFile()) {
          acc.files.push(dirent.name);
        }
        if (dirent.isDirectory()) {
          acc.directories.push(dirent.name);
        }
        return acc;
      },
      {
        files: [],
        directories: [],
      }
    );
    console.log(cyan("  #"), cyan("type     "), cyan("name"));
    dirents.directories
      .sort()
      .forEach((d, i) =>
        console.log(
          cyan.dark(i.toString().padStart(3, " ")),
          cyan.dark("directory"),
          cyan(d)
        )
      );
    dirents.files
      .sort()
      .forEach((f, i) =>
        console.log(
          cyan.dark(
            (i + dirents.directories.length).toString().padStart(3, " ")
          ),
          cyan.dark("file     "),
          cyan(f)
        )
      );
  },
};
