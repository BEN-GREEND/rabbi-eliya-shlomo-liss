/**
 * Hebrew text normalisation for search.
 *
 * Without this, Hebrew search simply does not work. Three things break it:
 *
 *   niqqud   — a title written with vowel points never matches a query typed
 *              without them, and nobody types them.
 *   geresh   — ״ ׳ (U+05F4, U+05F3) and " ' look identical and are used
 *              interchangeably; תשכ״ג and תשכ"ג must be the same word.
 *   finals   — ך ם ן ף ץ are the same letters as כ מ נ פ צ. Folding them lets
 *              a prefix query match a word it appears inside.
 */

const NIQQUD_AND_CANTILLATION = /[֑-ׇ]/g
const GERESH = /[׳‘’`´']/g
const GERSHAYIM = /[״“”„"]/g
const DASHES = /[־‐-―]/g

const FINAL_LETTERS: Record<string, string> = {
  ך: 'כ',
  ם: 'מ',
  ן: 'נ',
  ף: 'פ',
  ץ: 'צ',
}

/** Fold a Hebrew string to the form the index and the query both use. */
export function normalizeHebrew(input: string): string {
  return input
    .normalize('NFKD')
    .replace(NIQQUD_AND_CANTILLATION, '')
    .replace(GERESH, '')
    .replace(GERSHAYIM, '')
    .replace(DASHES, ' ')
    .replace(/[‎‏؜]/g, '')
    .replace(/[.,;:!?()[\]{}<>/\\|]/g, ' ')
    .split('')
    .map((ch) => FINAL_LETTERS[ch] ?? ch)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('he')
}

/** Split text into searchable terms. */
export function tokenizeHebrew(input: string): string[] {
  return normalizeHebrew(input)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 0)
}
