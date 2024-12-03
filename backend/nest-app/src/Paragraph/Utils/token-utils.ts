import { Token } from 'wink-tokenizer';

export function containsSpecialCharEng(
  arr: Token[],
  specialCharacters: string[],
): Token[] {
  let i = 0;
  const result: Token[] = [];

  while (i < arr.length) {
    if (
      arr[i].value === '[' &&
      i + 2 < arr.length &&
      arr[i + 2].value === ']' &&
      /^\d+$/.test(arr[i + 1].value)
    ) {
      i += 3;
      continue;
    }

    if (
      arr[i].tag !== 'punctuation' &&
      !specialCharacters.includes(arr[i].value)
    ) {
      result.push(arr[i]);
    }
    i++;
  }
  return result;
}
