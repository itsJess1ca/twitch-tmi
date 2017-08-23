export function splitLine(input: string, length: number): string[] {
  if (input.length <= length) return [input];
  const lastSpace = input.substring(0, length).lastIndexOf(" ");
  return [input.substring(0, lastSpace), input.substring(lastSpace + 1)];
}
