import { encode } from "../deps.ts";
import { ANSI, InputConf, Keys, KeySpec } from "../helpers.ts";
import { KeyMap, readInput } from "../mod.ts";

/**
 *
 * @param question The question to be asked
 * @param preference What input is preferred, i.e. executed on return
 */
export async function ynInput(
  question?: string,
  preference: "y" | "n" | "" = "",
  {
    yesName = "y",
    noName = "n",
    yesKeys = ["y", "Y"],
    noKeys = ["n", "N"],
    defaultKeys = ["return", "enter", new KeySpec({ key: "d", ctrl: true })],
    inputConf = {},
  }: {
    /**
     * The label for the yes Option, the default `y` results
     * in [y/n] or [Y/n] and Y after answering
     */
    yesName?: string;
    /**
     * Keys that will result in yes being selected
     */
    yesKeys?: Keys;
    /**
     * The label for the no Option, the default `n` results
     * in [y/n] or [y/N] and N after answering
     */
    noName?: string;
    /**
     * Keys that will result in no being selected
     */
    noKeys?: Keys;
    /**
     * Keys that will result in the @param preference being returned,
     * nothing happens when @param preference == ""
     */
    defaultKeys?: Keys;
    /**
     * Configuration Options for @function readInput()
     */
    inputConf?: InputConf;
  } = {},
) {
  const writer = inputConf.writer || Deno.stdout;
  await writer.write(
    encode(
      question +
        (preference
          ? (preference == "y"
            ? ` [${yesName.toLocaleUpperCase()}/${noName}]`
            : ` [${yesName}/${noName.toLocaleUpperCase()}]`)
          : ` [${yesName.toLocaleUpperCase()}/${noName.toLocaleUpperCase()}]`),
    ),
  );
  var answer = false;
  const map: KeyMap = new Map([
    [yesKeys, () => {
      answer = true;
      return { endinput: true };
    }],
    [noKeys, () => ({ endinput: true })],
  ]);
  if (preference) {
    map.set(defaultKeys, () => {
      answer = preference == "y";
      return { endinput: true };
    });
  }
  await readInput({
    keyMap: map,
    ...inputConf,
  });
  await writer.write(
    encode(
      ANSI.CSI +
        ANSI.CHA +
        ANSI.CSI +
        ANSI.EL +
        question + " " +
        (answer ? yesName.toLocaleUpperCase() : noName.toLocaleUpperCase()),
    ),
  );
  await writer.write(encode("\n"));
  return answer;
}
