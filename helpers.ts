import { Keypress } from "./deps.ts";
import { KeyMap, mapFunc } from "./mod.ts";

export function flatten(map: KeyMap) {
  const flatMap = new Map<KeySpec, mapFunc>();
  map.forEach((value, key) => {
    if (!(key instanceof Array)) key = [key];
    key.forEach((e) => {
      flatMap.set(KeySpec.of(e), value);
    });
  });
  return flatMap;
}

export type Keys =
  | KeySpec
  | string
  | RegExp
  | (KeySpec | string | RegExp)[];

export class KeySpec {
  key?: RegExp | string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  sequence?: RegExp | string;
  constructor({
    key,
    ctrl,
    meta,
    shift,
    sequence,
  }: {
    key?: RegExp | string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    sequence?: RegExp | string;
  } = {}) {
    this.key = key;
    this.ctrl = ctrl;
    this.meta = meta;
    this.shift = shift;
    this.sequence = sequence;
  }

  is(keypress: Keypress): boolean {
    return (
      (this.key == undefined ||
        (typeof this.key == "string"
          ? this.key == keypress.key
          : this.key.test(keypress.key ?? ""))) &&
      (this.ctrl == undefined || this.ctrl == keypress.ctrlKey) &&
      (this.meta == undefined || this.meta == keypress.metaKey) &&
      (this.shift == undefined || this.shift == keypress.shiftKey) &&
      (this.sequence == undefined ||
        (typeof this.sequence == "string"
          ? this.sequence == keypress.sequence
          : this.sequence.test(keypress.sequence)))
    );
  }

  static of(key: KeySpec | string | RegExp): KeySpec {
    if (key instanceof KeySpec) return key;
    if (key instanceof RegExp) {
      let source = key.source;
      if (source[0] != "^") source = "^" + source;
      if (source[source.length - 1] != "$") source += "$";
      key = new RegExp(source, key.flags);
    }
    return new KeySpec({ key: key, ctrl: false, meta: false });
  }
}

export enum ANSI {
  CSI = "\u001B[",
  CUU = "A",
  CUD = "B",
  CUF = "C",
  CUB = "D",
  CHA = "G",
  ED = "J",
  EL = "K",
  SCP = "s",
  RCP = "u",
}

export enum DeleteMode {
  FromCursor = 0,
  ToCursor = 1,
  Complete = 2,
}
