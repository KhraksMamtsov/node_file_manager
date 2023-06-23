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
import { help } from "./command.js";
import { magenta, cyan, red } from "./console.js";

const InvalidInput = () => new Error("Invalid input");
export async function step(args) {
  const { command } = args;

  const parseResult = parseCommand({ rawCommand: command });

  if (parseResult.type === "error") {
    console.log(red("Invalid input"));
  } else if (parseResult.type === "special") {
    if (parseResult.special === "help") {
      parseResult.commands.map((x) => help(x));
    }
  } else {
    const { command, args, subCommand } = parseResult;

    try {
      await command.run(args, subCommand);
    } catch (e) {
      console.log(e);
      console.log(red("Operation failed"));
    }
  }
}

const ARGUMENTS_DELIMITER = "=";
const KEY_PREFIX = "--";
const SPECIALS_PREFIX = "-";

function onExit(args) {
  args.rl.close();
  console.log(
    magenta.dark("Thank you for using File Manager,"),
    cyan(args.userName),
    magenta.dark(", goodbye!")
  );
  process.exit();
}

export async function main() {
  const [_execPath, _execFile, ...args] = process.argv;
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

  console.log(
    magenta.dark("Welcome to the File Manager,"),
    cyan(userName),
    magenta.dark("!")
  );
  process.chdir(os.homedir());
  console.log(magenta.dark("You are currently in"), magenta(process.cwd()));

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

    if (nextCommand.trim() === "-help") {
      knownCommands.forEach((knownCommand) => {
        help(knownCommand);
      });
      console.log(magenta.dark("You are currently in"), magenta(process.cwd()));
      return;
    }

    await step({
      command: nextCommand,
    });

    console.log(magenta.dark("You are currently in"), magenta(process.cwd()));
  });
}

const knownCommands = [
  upCommand,
  cdCommand,
  lsCommand,
  catCommand,
  addCommand,
  rnCommand,
  cpCommand,
  rmCommand,
  osCommand,
  hashCommand,
  compressCommand,
  decompressCommand,
];

function parseCommandArgs(args) {
  return args.reduce(
    (acc, arg) => {
      if (arg.startsWith(KEY_PREFIX)) {
        const subCommand = arg.slice(KEY_PREFIX.length);
        acc.subCommands.push(subCommand);
      } else if (arg.startsWith(SPECIALS_PREFIX)) {
        acc.specials.push(arg.slice(SPECIALS_PREFIX.length));
      } else {
        acc.args.push(arg);
      }
      return acc;
    },
    { subCommands: [], args: [], specials: [] }
  );
}
function parseCommand(args) {
  const { rawCommand } = args;

  const [parsedName, ...parsedCommandArgs] = rawCommand
    .trim()
    .split(" ")
    .filter((x) => x !== "");
  const sortedArgs = parseCommandArgs(parsedCommandArgs);

  const matchedCommandsByName = knownCommands.filter(
    (knownCommand) => knownCommand.name === parsedName
  );

  if (sortedArgs.specials.includes("help")) {
    return {
      type: "special",
      special: "help",
      commands: matchedCommandsByName,
    };
  }

  if (sortedArgs.subCommands.length > 1) {
    return E.left(InvalidInput());
  }
  const [parsedSubCommand] = sortedArgs.subCommands;

  const matchedCommands = knownCommands
    .filter((knownCommand) => knownCommand.name === parsedName)
    .filter(
      (knownCommand) =>
        (knownCommand.args?.length ?? 0) === sortedArgs.args.length
    )
    .filter((knownCommand) => {
      if (knownCommand.subCommand === undefined) {
        return parsedSubCommand === undefined;
      } else {
        return knownCommand.subCommand.some((x) => x.name === parsedSubCommand);
      }
    });

  if (matchedCommands.length > 1) {
    return {
      type: "error",
      error: "Ambigious command matching",
    };
  } else if (matchedCommands.length < 1) {
    return {
      type: "error",
      error: "No matched commands",
    };
  } else {
    const [targetCommand] = matchedCommands;

    return {
      type: "command",
      command: targetCommand,
      args: sortedArgs.args,
      subCommand: parsedSubCommand,
    };
  }
}

await main();
