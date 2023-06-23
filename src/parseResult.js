const ERROR_TYPE = "error";
/**
 * Creates error parsing result
 * @param {string} message
 * @returns {{type: 'error', message:string}}
 */
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
/**
 * Creates special help parsing result
 * @param {any} commands
 * @returns {{type: 'special', special: 'help', commands}}
 */
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

/**
 * Creates error parsing result
 * @param {any} options.command
 * @param {string[]} options.args
 * @param {string} options.subCommand
 * @returns {{type: 'command'}}
 */
export function command(options) {
  return {
    type: COMMAND_TYPE,
    ...options,
  };
}

export function isCommand(parseResult) {
  return parseResult.type === COMMAND_TYPE;
}
