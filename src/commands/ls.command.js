import fsP from "node:fs/promises";

export const lsCommand = {
  name: "ls",
  description:
    "Print in console list of all files and folders in current directory.",
  run: async (currentLocation) => {
    const dirents = (
      await fsP.readdir(currentLocation, {
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

    const resultView = [
      ...dirents.directories //
        .sort()
        .map((x) => ({ Name: x, Type: "directory" })),
      ...dirents.files //
        .sort()
        .map((x) => ({ Name: x, Type: "file" })),
    ];

    console.table(resultView);
  },
};
