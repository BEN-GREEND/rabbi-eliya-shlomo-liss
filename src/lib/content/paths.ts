import path from 'node:path'

/** Repository root. Content is read from disk at build time, never at request time. */
export const REPO_ROOT = process.cwd()
export const CONTENT_DIR = path.join(REPO_ROOT, 'content')
export const VOCAB_DIR = path.join(CONTENT_DIR, '_vocab')
export const PUBLIC_DIR = path.join(REPO_ROOT, 'public')

/** Turn an absolute path into the repo-relative form used in error messages. */
export function relPath(abs: string): string {
  return path.relative(REPO_ROOT, abs).split(path.sep).join('/')
}
