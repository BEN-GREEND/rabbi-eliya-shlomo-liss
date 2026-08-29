/** Hebrew labels for the kinds of thing the archive holds. */
export const DOC_TYPE_LABELS: Record<string, string> = {
  letter: 'מכתב',
  manuscript: 'כתב יד',
  certificate: 'תעודה',
  invitation: 'הזמנה',
  article: 'כתבה',
  scan: 'סריקה',
  document: 'מסמך',
}

export const TORAH_KIND_LABELS: Record<string, string> = {
  article: 'מאמר',
  lecture: 'שיעור',
  excerpt: 'קטע',
  letter: 'מכתב',
  manuscript: 'כתב יד',
  quote: 'ציטוט',
  book: 'ספר',
}

export const ACTIVITY_KIND_LABELS: Record<string, string> = {
  institution: 'מוסד',
  role: 'תפקיד',
  community: 'קהילה',
  initiative: 'יוזמה',
  event: 'אירוע',
  enterprise: 'מפעל ציבורי',
}

export const ASSET_STATUS_LABELS: Record<string, string> = {
  present: 'זמין לעיון',
  'not-digitized': 'קיים — טרם נסרק',
  'private-archive': 'בארכיון משפחתי פרטי',
  awaited: 'טרם הועלה',
  located: 'אותר — טרם הושג',
  sought: 'טרם אותר',
  lost: 'אבד',
  unavailable: 'אינו זמין',
}
