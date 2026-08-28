/**
 * Standalone content check.
 *
 *   npm run content:check
 *
 * Wired to `prebuild`, so `next build` cannot run while a reference is broken.
 */
import { formatReport, formatSummary } from './report'
import { validateContent } from './validate'

const started = Date.now()
const { problems, items, errorCount, warningCount } = validateContent()

if (problems.length) process.stdout.write(formatReport(problems) + '\n')
process.stdout.write(formatSummary(errorCount, warningCount, items.length))
process.stdout.write(`   (${Date.now() - started}ms)\n`)

process.exit(errorCount > 0 ? 1 : 0)
