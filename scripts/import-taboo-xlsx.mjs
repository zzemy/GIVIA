#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import XLSX from 'xlsx'

const ROOT_DIR = process.cwd()
const XLSX_DIR = path.join(ROOT_DIR, 'xlsx')
const OUTPUT_DIR = path.join(ROOT_DIR, 'data', 'taboos', 'retrieval')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'corpus.json')

const HEADER_ALIASES = {
  country: ['国家', '国别', 'country', 'Country'],
  category: ['品类', '类别', '分类', 'category', 'Category'],
  taboo: ['禁忌内容', '禁忌', '禁忌描述', 'taboo', 'Taboo'],
  reason: ['为什么', '原因', 'reason', 'Reason'],
  alternative: ['替代建议', '安全替代', '建议', 'alternative', 'Alternative'],
  source: ['来源', 'source', 'Source'],
  storyScore: ['故事性', '故事性⭐', '故事性★', 'story', 'Story'],
}

const COUNTRY_CODE_MAP = {
  china: 'CN',
  '中国': 'CN',
  japan: 'JP',
  '日本': 'JP',
  us: 'US',
  usa: 'US',
  '美国': 'US',
  unitedstates: 'US',
  france: 'FR',
  '法国': 'FR',
  germany: 'DE',
  '德国': 'DE',
}

const COUNTRY_NAME_MAP = {
  CN: 'China',
  JP: 'Japan',
  US: 'United States',
  FR: 'France',
  DE: 'Germany',
}

function normalizeText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeHeader(value) {
  return normalizeText(value).toLowerCase().replace(/[\s:_-]+/g, '')
}

function findValueByAliases(row, aliases) {
  const entries = Object.entries(row)
  const normalizedAliases = aliases.map(normalizeHeader)

  for (const [key, value] of entries) {
    const normalizedKey = normalizeHeader(key)
    if (normalizedAliases.includes(normalizedKey)) {
      return normalizeText(String(value ?? ''))
    }
  }

  return ''
}

function normalizeCountryCode(countryRaw) {
  const normalized = normalizeText(countryRaw).toLowerCase().replace(/[\s_()-]+/g, '')
  if (!normalized) {
    return 'GLOBAL'
  }

  return COUNTRY_CODE_MAP[normalized] ?? countryRaw.trim().toUpperCase().slice(0, 12)
}

function parseStoryScore(rawValue) {
  const value = normalizeText(rawValue)
  if (!value) {
    return 0
  }

  const starCount = (value.match(/[⭐★]/g) || []).length
  if (starCount > 0) {
    return Math.min(starCount, 5)
  }

  const numericValue = Number.parseInt(value, 10)
  if (Number.isInteger(numericValue)) {
    return Math.max(0, Math.min(numericValue, 5))
  }

  return 0
}

function createRecordFromRow(row, context) {
  const country = findValueByAliases(row, HEADER_ALIASES.country)
  const category = findValueByAliases(row, HEADER_ALIASES.category)
  const taboo = findValueByAliases(row, HEADER_ALIASES.taboo)
  const reason = findValueByAliases(row, HEADER_ALIASES.reason)
  const alternative = findValueByAliases(row, HEADER_ALIASES.alternative)
  const source = findValueByAliases(row, HEADER_ALIASES.source)
  const storyScoreRaw = findValueByAliases(row, HEADER_ALIASES.storyScore)

  if (!country || !taboo || !reason) {
    return null
  }

  const countryCode = normalizeCountryCode(country)
  const countryNameEn = COUNTRY_NAME_MAP[countryCode] ?? country

  return {
    id: `${countryCode.toLowerCase()}-${context.fileIndex}-${context.sheetIndex}-${context.rowIndex}`,
    countryCode,
    countryNameEn,
    category,
    taboo,
    reason,
    alternative,
    source,
    storyScore: parseStoryScore(storyScoreRaw),
    provenance: {
      file: context.fileName,
      sheet: context.sheetName,
    },
  }
}

function buildCorpus() {
  const fileNames = fs
    .readdirSync(XLSX_DIR)
    .filter(fileName => fileName.toLowerCase().endsWith('.xlsx'))
    .sort((left, right) => left.localeCompare(right, 'zh-CN'))

  const rawRecords = []

  fileNames.forEach((fileName, fileIndex) => {
    const absolutePath = path.join(XLSX_DIR, fileName)
    const workbook = XLSX.readFile(absolutePath)

    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      const sheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

      rows.forEach((row, rowIndex) => {
        const record = createRecordFromRow(row, {
          fileName,
          fileIndex,
          sheetName,
          sheetIndex,
          rowIndex,
        })

        if (record) {
          rawRecords.push(record)
        }
      })
    })
  })

  const deduped = new Map()

  for (const record of rawRecords) {
    const dedupeKey = [
      record.countryCode,
      normalizeHeader(record.category),
      normalizeHeader(record.taboo),
      normalizeHeader(record.reason),
    ].join('|')

    if (!deduped.has(dedupeKey)) {
      deduped.set(dedupeKey, record)
      continue
    }

    const current = deduped.get(dedupeKey)
    if (record.storyScore > current.storyScore) {
      deduped.set(dedupeKey, record)
    }
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceDirectory: 'xlsx',
    sourceFiles: fileNames,
    records: Array.from(deduped.values()),
  }
}

function main() {
  if (!fs.existsSync(XLSX_DIR)) {
    console.error(`[taboo import] xlsx directory not found: ${XLSX_DIR}`)
    process.exit(1)
  }

  const corpus = buildCorpus()
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(corpus, null, 2)}\n`, 'utf8')

  console.log(`[taboo import] wrote ${corpus.records.length} records to ${path.relative(ROOT_DIR, OUTPUT_FILE)}`)
}

main()