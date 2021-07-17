import { encode } from "../deps.ts";
import { InputConf, Keys, KeySpec } from "../helpers.ts";
import { readInput } from "../mod.ts";
import { advancedCompletion, generateKeyMap } from "../utils.ts";

// TODO Regex Keywords, and "parallel" subentries for argument completion
type cliEntry = {
  /**
   * possible names for command
   */
  keywords: string | string[];
  /**
   * commands that can be chained to this one
   */
  subEntries?: cliEntries;
  /**
   * Function to execute when pressing enter.
   * The returned string is printed
   * If @constant END_OF_INPUT (-1) is returned the cli input will close
   */
  exec?: cliFunction;
};

type cliFunction =
  | string
  | typeof END_OF_INPUT
  | ((
    args: string[],
  ) =>
    | Promise<typeof END_OF_INPUT | string | void>
    | (typeof END_OF_INPUT | string | void));

/**
 * If returned by an cliEntry's exec, the cli input will close
 */
export const END_OF_INPUT = -1;

type cliArray = cliEntry[];
export type cliEntries = cliArray | (() => cliArray);

// TODO Implement support for highlighting
/**
 * A simple interactive cliInput with Tab completion
 * @param cliEntries An Array or a Function returning an Array of `cliEntry`s
 */
export async function cliInput(
  cliEntries: cliEntries,
  {
    endLine = ["enter", "return"],
    endInput = [new KeySpec({ ctrl: true, key: /[cd]/ })],
    errorMessage = "",
    inputPre = "",
    outputPre = "",
    inputConf = {},
  }: {
    /**
     * Keys submitting the input for evaluation
     */
    endLine?: Keys;
    /**
     * Keys ending the CLI Input, without evaluating current input
     */
    endInput?: Keys;
    /**
     * Message to be send, when an unknown command is entered
     */
    errorMessage?: string;
    /**
     * Prefix of the input lines
     */
    inputPre?: string;
    /**
     * Prefix of the output lines
     */
    outputPre?: string;
    /**
     * Configuration Options for @function readInput()
     */
    inputConf?: InputConf;
  } = {},
) {
  const writer = inputConf.writer || Deno.stdout;
  while (true) {
    let done = false;
    const map = generateKeyMap(1, {
      completion: advancedCompletion((line, lastWord) => {
        const iWords = line.trim().split(/\s+/);
        const { options, words } = walkCli(
          iWords,
          cliEntries,
          iWords.length - 1,
        );
        if (words.length > 1 || !options) return [];

        const cliArray = typeof options == "function" ? options() : options;
        const word = words[words.length - 1];

        return cliArray
          .filter((v) =>
            typeof v.keywords == "string"
              ? v.keywords.startsWith(word)
              : v.keywords.some((k) => k.startsWith(word))
          )
          .reduce(
            (a: string[], b): string[] =>
              typeof b.keywords == "string"
                ? a.concat([b.keywords])
                : a.concat(b.keywords),
            [],
          );
      }),
      endKeys: endLine,
    });
    map.set(endInput, () => {
      done = true;
      return { endinput: true };
    });
    const input = (
      await readInput({
        keyMap: map,
        prefix: inputPre,
        ...inputConf,
      })
    )
      .replace("\n", "")
      .toLocaleLowerCase();

    const { exec, words } = walkCli(input.trim().split(/\s+/), cliEntries);
    const res = typeof exec == "function" ? await exec(words) : exec;
    if (done || res === -1) {
      await writer.write(encode("\n"));
      return;
    }
    await writer.write(
      encode(
        "\n" + outputPre + (res || errorMessage).replace(/\n\r?/g, (v) =>
          v + outputPre) +
          "\n",
      ),
    );
  }
}

function walkCli(
  words: string[],
  cli: cliEntries = [],
  limit = Infinity,
  exec?: cliFunction,
  args: string[] = [],
): {
  words: string[];
  options?: cliEntries;
  exec?: cliFunction;
} {
  const cliArray = typeof cli == "function" ? cli() : cli;

  if (words.length == 0 || limit <= 0 || cliArray.length == 0) {
    return { options: cli, words: args.concat(...words), exec: exec };
  }

  const word = words[0];

  const next = cliArray.find((elem) =>
    typeof elem.keywords == "string"
      ? elem.keywords == word
      : elem.keywords.includes(word)
  );

  if (next) {
    return walkCli(
      words.slice(1),
      next.subEntries,
      limit - 1,
      next.exec || exec,
      next.exec ? [] : args.concat(word),
    );
  }
  return { words: words, options: cli };
}
