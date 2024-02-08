const ERROR_TYPE = "error";

export function error(message) {
  return {
    type: ERROR_TYPE,
    message,
  };
}

export function isError(parseResult) {
  return parseResult.type === ERROR_TYPE;
}

const SPECIAL_TYPE = "special";

export function help(commands) {
  return {
    type: SPECIAL_TYPE,
    special: "help",
    commands,
  };
}

export function isSpecial(parseResult) {
  return parseResult.type === SPECIAL_TYPE;
}

const COMMAND_TYPE = "command";

export function command(options) {
  return {
    type: COMMAND_TYPE,
    ...options,
  };
}

export function isCommand(parseResult) {
  return parseResult.type === COMMAND_TYPE;
}
