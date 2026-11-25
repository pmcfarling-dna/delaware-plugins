#!/usr/bin/env node
/**
 * Reads a Word .docx into Markdown, for kb-draft. Depends on nothing but Node
 * itself (node:zlib), so there is nothing to install or pin.
 *
 *   node read-docx.mjs <file.docx> [--out <file.md>]
 *
 * Markdown goes to stdout, or to --out. Notes about what was not read go to
 * stderr, one per line, starting "NOTE:". Exit codes:
 *   0  read
 *   2  refused (REFUSED: ... on stderr): not a plain modern Word file
 *   3  not established (NOT ESTABLISHED: ... on stderr): too little text
 *   1  usage or an unexpected error
 *
 * It refuses, it does not guess: an encrypted file, a legacy .doc, a file that
 * carries a macro project, an extension that disagrees with the content, an
 * archive that is too large or malformed. Embedded images are dropped and
 * counted. Headings become # levels; tables become pipe tables.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inflateRawSync } from 'node:zlib'

/** The web intake's floor: word characters (letters, digits, underscore) below which a source is "not established". */
export const MIN_WORD_CHARS = 50
const MAX_ENTRIES = 5000
const MAX_PART_BYTES = 20 * 1024 * 1024
const MAX_TOTAL_BYTES = 60 * 1024 * 1024

export class Refused extends Error {
  constructor(message) { super(message); this.name = 'Refused' }
}
export class NotEstablished extends Error {
  constructor(message) { super(message); this.name = 'NotEstablished' }
}

const OLE_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])

/** The parts of a zip archive, as Map<name, () => Buffer>; refuses what it cannot read safely. */
function zipParts(buf) {
  let eocd = -1
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Refused('the file is not a valid zip archive, so it is not a modern Word file')
  const count = buf.readUInt16LE(eocd + 10)
  let p = buf.readUInt32LE(eocd + 16)
  if (count > MAX_ENTRIES) throw new Refused(`the archive holds ${count} parts, more than the ${MAX_ENTRIES} this reader accepts`)
  const parts = new Map()
  let total = 0
  for (let n = 0; n < count; n++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) throw new Refused('the archive directory is damaged')
    const method = buf.readUInt16LE(p + 10)
    const flags = buf.readUInt16LE(p + 8)
    const csize = buf.readUInt32LE(p + 20)
    const usize = buf.readUInt32LE(p + 24)
    const nlen = buf.readUInt16LE(p + 28)
    const elen = buf.readUInt16LE(p + 30)
    const clen = buf.readUInt16LE(p + 32)
    const local = buf.readUInt32LE(p + 42)
    const name = buf.subarray(p + 46, p + 46 + nlen).toString('utf8')
    p += 46 + nlen + elen + clen
    if (name.includes('..') || name.startsWith('/')) throw new Refused('the archive holds a part with an unsafe path')
    total += usize
    if (usize > MAX_PART_BYTES || total > MAX_TOTAL_BYTES) throw new Refused('the archive expands to more than this reader accepts')
    if (flags & 1) throw new Refused('the file is encrypted. Remove the password in Word and save it again')
    parts.set(name, () => {
      if (local + 30 > buf.length || buf.readUInt32LE(local) !== 0x04034b50) throw new Refused('the archive is damaged')
      const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28)
      const raw = buf.subarray(start, start + csize)
      if (method === 0) return Buffer.from(raw)
      if (method === 8) return inflateRawSync(raw, { maxOutputLength: MAX_PART_BYTES })
      throw new Refused(`the archive uses a compression method (${method}) this reader does not support`)
    })
  }
  return parts
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
const decode = (s) =>
  s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-z]+);/g, (m, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ''
    }
    return ENTITIES[e] ?? m
  })

/** style id -> heading level (1 to 6; Title is 1), from word/styles.xml. */
function headingStyles(xml) {
  const map = new Map()
  if (!xml) return map
  for (const m of xml.matchAll(/<w:style\b[^>]*\bw:styleId="([^"]+)"[^>]*>([\s\S]*?)<\/w:style>/g)) {
    const name = /<w:name\b[^>]*\bw:val="([^"]+)"/.exec(m[2])?.[1] ?? ''
    const h = /^heading\s*(\d)$/i.exec(name)
    if (h) map.set(m[1], Math.min(6, Number(h[1])))
    else if (/^title$/i.test(name)) map.set(m[1], 1)
  }
  return map
}

const cell = (s) => s.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()

/** Markdown from word/document.xml. Returns { md, images }. */
function documentToMarkdown(xml, styles) {
  const out = []
  let images = 0
  const tag = /<(\/?)w:([A-Za-z]+)\b([^>]*?)(\/?)>|([^<]+)/g
  let para = null // { text, heading, list }
  let table = null // { rows: [[cell]], depth }
  let depth = 0
  let row = null
  let cellText = null
  let inText = false

  const emit = (p) => {
    const text = p.text.replace(/[ \t]+/g, ' ').trim()
    if (!text) return
    if (cellText !== null) { cellText += (cellText ? ' ' : '') + text; return }
    if (p.heading) out.push(`${'#'.repeat(p.heading)} ${text}`, '')
    else if (p.list !== null) out.push(`${'  '.repeat(p.list)}- ${text}`)
    else out.push(text, '')
  }

  for (let m; (m = tag.exec(xml)); ) {
    if (m[5] !== undefined) { if (inText && para) para.text += decode(m[5]); continue }
    const [, close, name, attrs, selfClose] = m
    const closing = close === '/'
    switch (name) {
      case 'tbl':
        if (!closing) {
          depth++
          if (depth === 1) table = { rows: [] }
        } else {
          if (depth === 1 && table) {
            const w = Math.max(1, ...table.rows.map((r) => r.length))
            const line = (r) => `| ${Array.from({ length: w }, (_, i) => r[i] ?? '').join(' | ')} |`
            if (table.rows.length) {
              out.push(line(table.rows[0]), `|${' --- |'.repeat(w)}`)
              for (const r of table.rows.slice(1)) out.push(line(r))
              out.push('')
            }
            table = null
          }
          depth--
        }
        break
      case 'tr':
        if (depth === 1) { if (!closing) row = []; else { if (row && table) table.rows.push(row); row = null } }
        break
      case 'tc':
        if (depth === 1) {
          if (!closing) cellText = ''
          else { if (row) row.push(cell(cellText ?? '')); cellText = null }
        }
        break
      case 'p':
        if (!closing && !selfClose) para = { text: '', heading: 0, list: null }
        else if (closing && para) {
          // inside a nested table's cell the text joins the outer cell
          if (depth > 1) { const t = para.text.trim(); if (t && cellText !== null) cellText += (cellText ? ' / ' : '') + t }
          else emit(para)
          para = null
        }
        break
      case 'pStyle': {
        const id = /\bw:val="([^"]+)"/.exec(attrs)?.[1]
        if (para && id && styles.has(id)) para.heading = styles.get(id)
        break
      }
      case 'outlineLvl': {
        const lvl = /\bw:val="(\d)"/.exec(attrs)?.[1]
        if (para && lvl !== undefined && !para.heading) para.heading = Math.min(6, Number(lvl) + 1)
        break
      }
      case 'ilvl':
        if (para) para.list = Number(/\bw:val="(\d+)"/.exec(attrs)?.[1] ?? 0)
        break
      case 'numPr':
        if (para && !closing && para.list === null) para.list = 0
        break
      case 't':
        inText = !closing && !selfClose
        break
      case 'tab':
        if (para && !closing) para.text += ' '
        break
      case 'br':
        if (para && !closing) para.text += ' '
        break
      case 'drawing':
      case 'pict':
        if (!closing) images++
        break
      default:
    }
  }
  return { md: out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n', images }
}

/**
 * Reads a .docx (a Buffer) into Markdown.
 * @param {Buffer} buf
 * @param {string} [filename]  used only to compare its extension with the content
 * @returns {{ markdown: string, notes: string[] }}
 */
export function readDocx(buf, filename = '') {
  const ext = extname(filename).toLowerCase()
  if (ext === '.doc') throw new Refused('this is a legacy .doc file. Open it in Word and save it as .docx')
  if (ext === '.docm') throw new Refused('a .docm file can carry macros. Save a copy as .docx without macros')
  if (buf.length >= 8 && buf.subarray(0, 8).equals(OLE_MAGIC)) {
    const encrypted = buf.includes(Buffer.from('EncryptedPackage', 'utf16le'))
    throw new Refused(encrypted
      ? 'the file is encrypted. Remove the password in Word and save it again'
      : 'this is a legacy Word file, whatever its extension. Open it in Word and save it as .docx')
  }
  if (buf.length < 4 || buf.readUInt32LE(0) !== 0x04034b50) {
    throw new Refused('the content is not a Word file, whatever the extension says')
  }
  if (ext && ext !== '.docx') throw new Refused(`the extension is ${ext} but the content is a zip archive; say what the file really is`)
  const parts = zipParts(buf)
  const names = [...parts.keys()]
  if (!parts.has('[Content_Types].xml') || !parts.has('word/document.xml')) {
    throw new Refused('the archive is not a Word document (it has no word/document.xml)')
  }
  if (names.some((n) => /(^|\/)vbaProject\.bin$/i.test(n)) || /macroEnabled/i.test(parts.get('[Content_Types].xml')().toString('utf8'))) {
    throw new Refused('the file carries a macro project. Save a copy as .docx without macros')
  }
  const notes = []
  const stylesXml = parts.has('word/styles.xml') ? parts.get('word/styles.xml')().toString('utf8') : ''
  const { md, images } = documentToMarkdown(parts.get('word/document.xml')().toString('utf8'), headingStyles(stylesXml))
  if (images) notes.push(`${images} embedded image${images === 1 ? '' : 's'} not read: ask the person what they show if it matters`)
  for (const [part, what] of [['word/footnotes.xml', 'footnotes'], ['word/endnotes.xml', 'endnotes'], ['word/comments.xml', 'comments']]) {
    if (parts.has(part) && /<w:t\b/.test(parts.get(part)().toString('utf8'))) notes.push(`${what} are not read`)
  }
  if (names.some((n) => /^word\/(header|footer)\d*\.xml$/.test(n))) notes.push('headers and footers are not read')
  const chars = (md.match(/[\p{L}\p{N}_]/gu) ?? []).length
  if (chars < MIN_WORD_CHARS) {
    throw new NotEstablished(`only ${chars} word characters came out (the floor is ${MIN_WORD_CHARS}), too little to draft from. Do not draft from this file`)
  }
  return { markdown: md, notes }
}

function main(argv) {
  const args = argv.slice(2)
  const out = args.indexOf('--out')
  const outFile = out >= 0 ? args.splice(out, 2)[1] : undefined
  const file = args[0]
  if (!file || (out >= 0 && !outFile)) {
    console.error('usage: node read-docx.mjs <file.docx> [--out <file.md>]')
    return 1
  }
  try {
    const { markdown, notes } = readDocx(readFileSync(file), file)
    if (outFile) writeFileSync(outFile, markdown)
    else process.stdout.write(markdown)
    for (const n of notes) console.error(`NOTE: ${n}`)
    return 0
  } catch (e) {
    if (e instanceof Refused) { console.error(`REFUSED: ${e.message}`); return 2 }
    if (e instanceof NotEstablished) { console.error(`NOT ESTABLISHED: ${e.message}`); return 3 }
    console.error(`ERROR: ${e instanceof Error ? e.message : String(e)}`)
    return 1
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exitCode = main(process.argv)
