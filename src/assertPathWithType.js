import * as fsP from "node:fs/promises";
import * as path from "node:path";

export async function assertPathWithType(opts) {
  const { checkPath, type } = opts;
  const basename = path.basename(checkPath);
  const dirname = path.dirname(checkPath);

  const dirents = await fsP.readdir(dirname, {
    withFileTypes: true,
  });

  const isRightAssertion = dirents
    .filter((dirent) => dirent.name === basename)
    .some((dirent) =>
      type === "file" ? dirent.isFile() : dirent.isDirectory()
    );

  if (!isRightAssertion) {
    throw new Error("Wrong path assertion.");
  }
}
