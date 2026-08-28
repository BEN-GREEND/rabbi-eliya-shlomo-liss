/**
 * Turns validation problems into something a person can act on without
 * opening the code: which file, which field, which id, what it should have
 * pointed at, and the nearest thing that exists.
 */
import type { Problem } from './validate'

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const c = (code: string, s: string) => (useColor ? `[${code}m${s}[0m` : s)
const red = (s: string) => c('31', s)
const yellow = (s: string) => c('33', s)
const green = (s: string) => c('32', s)
const dim = (s: string) => c('2', s)
const bold = (s: string) => c('1', s)

function row(label: string, value: string): string {
  return `  ${dim(label.padEnd(18, ' '))}${value}`
}

function renderProblem(p: Problem): string {
  const lines: string[] = []
  if (p.field) lines.push(row('שדה:', p.field))
  if (p.value) lines.push(row('ערך:', `"${p.value}"`))
  if (p.expected) lines.push(row('אמור להצביע ל:', p.expected))
  lines.push(row('התוצאה:', p.message))
  if (p.suggestion) lines.push(row('האם התכוונת ל:', green(`"${p.suggestion}"`)))
  if (p.known?.length) lines.push(row('ערכים קיימים:', dim(p.known.join(' · '))))
  return lines.join('\n')
}

export function formatReport(problems: Problem[]): string {
  const errors = problems.filter((p) => p.severity === 'error')
  const warnings = problems.filter((p) => p.severity === 'warning')
  const out: string[] = []

  const groups = [
    { heading: 'שגיאות שלמות קשרים', mark: '✖', list: errors, colour: red },
    { heading: 'אזהרות', mark: '⚠', list: warnings, colour: yellow },
  ]

  for (const { heading, mark, list, colour } of groups) {
    if (!list.length) continue
    out.push('')
    out.push(colour(bold(`${mark}  ${heading}  (${list.length})`)))

    const byFile = new Map<string, Problem[]>()
    for (const p of list) byFile.set(p.filePath, [...(byFile.get(p.filePath) ?? []), p])

    for (const [file, fileProblems] of byFile) {
      out.push('')
      out.push(bold(file))
      out.push(fileProblems.map(renderProblem).join('\n\n'))
    }
  }

  return out.join('\n')
}

export function formatSummary(errorCount: number, warningCount: number, itemCount: number): string {
  if (errorCount === 0) {
    const warn = warningCount ? yellow(`  (${warningCount} אזהרות)`) : ''
    return `\n${green('✔')}  ${itemCount} פריטים נבדקו. כל הקשרים תקינים.${warn}\n`
  }
  return `\n${red(bold(`${errorCount} שגיאות`))} · ${itemCount} פריטים נבדקו.  ${red('ה-build נעצר.')}\n`
}
