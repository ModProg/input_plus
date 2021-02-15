import { ANSI, DeleteMode, flatten, Keys } from "./helpers.ts";
import { decodeKeypress, encode, Keypress } from "./deps.ts";
import { generateKeyMap } from "./utils.ts";

export type mapFunc = (args: {
  input: string;
  lines: string[];
  cursorX: number;
  cursorY: number;
  key: Keypress;
  state: State;
}) =>
  | {
    lines?: string[] | undefined;
    cursorX?: number | undefined;
    cursorY?: number | undefined;
    endinput?: boolean | undefined;
    state?: State;
  }
  | {
    input?: string | undefined;
    cursorX?: number | undefined;
    cursorY?: number | undefined;
    endinput?: boolean | undefined;
    state?: State;
  };

export type State = {
  /**
   * Index of current keypress, 0 based
   */
  keyPressIndex: number;
  [key: string]: unknown;
};

export type KeyMap = Map<Keys, mapFunc>;

export async function readInput({
  reader = Deno.stdin,
  writer = Deno.stdout,
  keyMap = generateKeyMap(),
  bufferLength = 1024,
  highlighter = (input) => input,
  setRaw = true,
  prefix = "",
}: {
  reader?: Deno.Reader & { rid: number };
  writer?: Deno.Writer;
  keyMap?: KeyMap;
  bufferLength?: number;
  highlighter?: (line: string) => string;
  setRaw?: boolean;
  prefix?: string;
} = {}): Promise<string> {
  if (setRaw) {
    if (!Deno.isatty(reader.rid)) {
      throw new Error("Advanced features only available on TTY.");
    } else {
      Deno.setRaw(reader.rid, true);
    }
  }

  const flatMap = flatten(keyMap);
  var lines: string[] = [""];
  const buffer = new Uint8Array(bufferLength);
  var cursorX = 0;
  var cursorY = 0;
  const xOffset = prefix.length;
  const state: State = {
    keyPressIndex: 0,
  };

  writer.write(encode(prefix));

  while (true) {
    const length = <number> await reader.read(buffer);
    const events = decodeKeypress(buffer.subarray(0, length));
    for (const event of events) {
      let todo: {
        lines?: string[] | undefined;
        input?: string | undefined;
        cursorX?: number | undefined;
        cursorY?: number | undefined;
        endinput?: boolean | undefined;
      } = {};
      for (const mapping of flatMap) {
        if (mapping[0].is(event)) {
          todo = mapping[1]({
            input: lines[cursorY],
            lines: lines.slice(),
            cursorX: cursorX,
            cursorY: cursorY,
            key: event,
            state: state,
          });
        }
      }
      state.keyPressIndex++;
      if (todo.lines) {
        lines = todo.lines;
        await writer.write(
          encode(
            (0 != cursorY ? ANSI.CSI + cursorY + ANSI.CUU : "") +
              ANSI.CSI + 1 + ANSI.CHA + //move to beginning of line
              ANSI.CSI + ANSI.ED + // clear Screen
              ANSI.CSI + ANSI.SCP + // save Cursor Position
              prefix + lines.map(highlighter).join("\n" + prefix) +
              ANSI.CSI + ANSI.RCP + // return to saved Cursor Position
              ANSI.CSI + (cursorX + 1 + xOffset) + ANSI.CHA + // move to cursorX
              (0 != cursorY ? ANSI.CSI + cursorY + ANSI.CUD : ""),
          ),
        );
      }
      if (todo.cursorY != undefined) {
        todo.cursorY = Math.min(
          Math.max(todo.cursorY ?? 0, 0),
          lines.length - 1,
        );
        if (todo.cursorY != cursorY) {
          const oldY = cursorY;
          cursorY = Math.min(Math.max(todo.cursorY, 0), lines.length - 1);
          await writer.write(
            encode(
              ANSI.CSI +
                Math.abs(oldY - cursorY) +
                (oldY > cursorY ? ANSI.CUU : ANSI.CUD),
            ),
          );
        }
      }
      if (todo.input != undefined) {
        lines[cursorY] = todo.input;
        await writer.write(
          encode(
            ANSI.CSI +
              ANSI.SCP + // save Cursor Position
              ANSI.CSI +
              1 +
              ANSI.CHA + // move to beginning of line
              ANSI.CSI +
              DeleteMode.Complete +
              ANSI.EL + // clear line
              prefix +
              highlighter(todo.input) +
              ANSI.CSI +
              ANSI.RCP, // return to saved Cursor Position
          ),
        );
      }
      if (todo.cursorX != undefined && todo.cursorX != cursorX) {
        cursorX = Math.min(Math.max(todo.cursorX, 0), lines[cursorY].length);
        await writer.write(
          encode(ANSI.CSI + (cursorX + 1 + xOffset) + ANSI.CHA),
        );
      }

      if (todo.endinput) {
        if (setRaw) {
          Deno.setRaw(reader.rid, false);
        }
        return lines.join("\n");
      }
    }
  }
}
