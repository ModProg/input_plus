import { ANSI, DeleteMode, flatten, Keys } from "./helpers.ts";
import { decodeKeypress, Keypress } from "./deps.ts";
import { generateKeyMap } from "./utils.ts";

export type mapFunc = (args: {
  input: string;
  lines: string[];
  cursorX: number;
  cursorY: number;
  key: Keypress;
}) =>
  | {
    lines?: string[] | undefined;
    cursorX?: number | undefined;
    cursorY?: number | undefined;
    endinput?: boolean | undefined;
  }
  | {
    input?: string | undefined;
    cursorX?: number | undefined;
    cursorY?: number | undefined;
    endinput?: boolean | undefined;
  };

export type KeyMap = Map<Keys, mapFunc>;

export async function readInput({
  reader = Deno.stdin,
  writer = Deno.stdout,
  keyMap = generateKeyMap(),
  bufferLength = 1024,
}: {
  reader?: Deno.Reader & { rid: number };
  writer?: Deno.Writer;
  keyMap?: KeyMap;
  valid?: (input: string) => boolean;
  endInput?: string[];
  highlighter?: (input: string) => string;
  bufferLength?: number;
} = {}): Promise<string> {
  if (!Deno.isatty(reader.rid)) {
    throw new Error("Keypress can be read only under TTY.");
  }
  const flatMap = flatten(keyMap);
  const encoder = new TextEncoder();
  var lines: string[] = [""];
  const buffer = new Uint8Array(bufferLength);
  Deno.setRaw(reader.rid, true);
  var cursorX = 0;
  var cursorY = 0;
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
          });
        }
      }
      if (todo.lines) {
        lines = todo.lines;
        await writer.write(
          encoder.encode(
            (0 != cursorY ? ANSI.CSI + cursorY + ANSI.CUU : "") +
              ANSI.CSI + 1 + ANSI.CHA + //move to beginning of line
              ANSI.CSI + ANSI.ED + // clear Screen
              ANSI.CSI + ANSI.SCP + // save Cursor Position
              lines.join("\n") +
              ANSI.CSI + ANSI.RCP + // return to saved Cursor Position
              ANSI.CSI + (cursorX + 1) + ANSI.CHA + // move to cursorX
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
            encoder.encode(
              ANSI.CSI + Math.abs(oldY - cursorY) +
                (oldY > cursorY ? ANSI.CUU : ANSI.CUD),
            ),
          );
        }
      }
      if (todo.input != undefined) {
        lines[cursorY] = todo.input;
        await writer.write(encoder.encode(
          ANSI.CSI + ANSI.SCP + // save Cursor Position
            ANSI.CSI + 1 + ANSI.CHA + // move to beginning of line
            ANSI.CSI + DeleteMode.Complete + ANSI.EL + // clear line
            todo.input +
            ANSI.CSI + ANSI.RCP, // return to saved Cursor Position
        ));
      }
      if (todo.cursorX != undefined && todo.cursorX != cursorX) {
        cursorX = Math.min(
          Math.max(todo.cursorX, 0),
          lines[cursorY].length,
        );
        await writer.write(encoder.encode(ANSI.CSI + (cursorX + 1) + ANSI.CHA));
      }

      if (todo.endinput) {
        Deno.setRaw(reader.rid, false);
        return lines.join("\n");
      }
    }
  }
}
