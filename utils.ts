export function basicHighlighter(
  highlighting: Map<
    (RegExp | string)[] | RegExp | string,
    (input: string) => string | ((input: string) => string)[]
  >
): (input: string) => string {
  return (text) => text;
}

export function basicCompletion(
  completion: ([RegExp | string, string] | string)[],
  completeLine = false
): (input: string) => string {
  return (text) => text;
}
