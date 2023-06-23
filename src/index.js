import * as readline from "node:readline/promises";
import * as os from "node:os";
import * as E from "./either.js";
import { addCommand } from "./commands/add.command.js";
import { cdCommand } from "./commands/cd.command.js";
import { rmCommand } from "./commands/rm.command.js";
import { upCommand } from "./commands/up.command.js";
import { rnCommand } from "./commands/rn.command.js";
import { catCommand } from "./commands/cat.command.js";
import { lsCommand } from "./commands/ls.command.js";
import { compressCommand } from "./commands/compress.command.js";
import { decompressCommand } from "./commands/decompress.command.js";
import { hashCommand } from "./commands/hash.command.js";
import { osCommand } from "./commands/os.command.js";
import { cpCommand } from "./commands/cp.command.js";

const InvalidInput = () => new Error("Invalid input");
export async function step(args) {
  const { currentLocation, command } = args;

  const parseResult = parseCommand({ rawCommand: command });

  if (E.isLeft(parseResult)) {
    console.log("Invalid input");
    return { nextLocation: currentLocation };
  } else {
    const { command, args, subCommand } = parseResult.right;
    let locationFromCommand;
    try {
      locationFromCommand = await command.run(
        currentLocation,
        args,
        subCommand
      );
    } catch (e) {
      console.log(111, e);
      console.log("Operation failed");
    }

    return { nextLocation: locationFromCommand ?? currentLocation };
  }
}

const ARGUMENTS_DELIMITER = "=";
const KEY_PREFIX = "--";

function onExit(args) {
  args.rl.close();
  console.log(`Thank you for using File Manager, ${args.userName}, goodbye!`);
  process.exit();
}

export async function main() {
  const [_execPath, _execFile, ...args] = process.argv;
  console.log(args);

  const parsedArguments = Object.fromEntries(
    args.flatMap((arg) => {
      const [rawKey, ...splittedValue] = arg.split(ARGUMENTS_DELIMITER);

      if (!rawKey.startsWith(KEY_PREFIX) || rawKey === KEY_PREFIX) {
        return [];
      }

      const parsedKey = rawKey.slice(KEY_PREFIX.length);

      return [[parsedKey, splittedValue.join(ARGUMENTS_DELIMITER)]];
    })
  );

  const userName = parsedArguments.username || "Anonymous";

  console.log(`Welcome to the File Manager, ${userName}!`);
  let currentLocation = os.homedir();
  console.log(`You are currently in ${currentLocation}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  rl.on("SIGINT", function () {
    onExit({ rl, userName });
  });
  rl.on("close", () => {
    onExit({ rl, userName });
  });

  rl.on("line", async (nextCommand) => {
    if (nextCommand.trim() === ".exit") {
      return rl.close();
    }

    const { nextLocation } = await step({
      currentLocation,
      command: nextCommand,
    });

    currentLocation = nextLocation;
    console.log(`You are currently in ${currentLocation}`);
  });
}

const knownCommands = [
  addCommand,
  cdCommand,
  rmCommand,
  rnCommand,
  cpCommand,
  catCommand,
  compressCommand,
  decompressCommand,
  osCommand,
  lsCommand,
  upCommand,
  hashCommand,
];

function parseCommandArgs(args) {
  return args.reduce(
    (acc, arg) => {
      if (arg.startsWith("--")) {
        const subCommand = arg.slice(KEY_PREFIX.length);
        acc.subCommands.push(subCommand);
      } else {
        acc.args.push(arg);
      }
      return acc;
    },
    { subCommands: [], args: [] }
  );
}
function parseCommand(args) {
  const { rawCommand } = args;

  const [parsedName, ...parsedCommandArgs] = rawCommand
    .trim()
    .split(" ")
    .filter((x) => x !== "");
  const sortedArgs = parseCommandArgs(parsedCommandArgs);

  if (sortedArgs.subCommands.length > 1) {
    return E.left(InvalidInput());
  }
  const [parsedSubCommand] = sortedArgs.subCommands;

  const matchedCommands = knownCommands
    .filter((knownCommand) => knownCommand.name === parsedName)
    .filter(
      (knownCommand) =>
        (knownCommand.args.length ?? 0) === sortedArgs.args.length
    )
    .filter((knownCommand) => {
      if (knownCommand.subCommand === undefined) {
        return parsedSubCommand === undefined;
      } else {
        return knownCommand.subCommand.includes(parsedSubCommand);
      }
    });

  if (matchedCommands.length > 1) {
    return E.left(InvalidInput());
  } else if (matchedCommands.length < 1) {
    return E.left(InvalidInput());
  } else {
    const [targetCommand] = matchedCommands;

    return E.right({
      command: targetCommand,
      args: sortedArgs.args,
      subCommand: parsedSubCommand,
    });
  }
}

await main();
