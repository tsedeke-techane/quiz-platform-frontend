"use client"

import React from 'react'

interface MathRendererProps {
  text: string
  displayMode?: boolean
  className?: string
}

// Map of common vulgar fractions to their Unicode equivalents
const FRACTION_MAP: Record<string, string> = {
  '1/2': '½',
  '1/3': '⅓',
  '2/3': '⅔',
  '1/4': '¼',
  '3/4': '¾',
  '1/5': '⅕',
  '2/5': '⅖',
  '3/5': '⅗',
  '4/5': '⅘',
  '1/6': '⅙',
  '5/6': '⅚',
  '1/7': '⅐',
  '1/8': '⅛',
  '3/8': '⅜',
  '5/8': '⅝',
  '7/8': '⅞',
  '1/9': '⅑',
  '1/10': '⅒',
}

function normalizeDollarDelimiters(input: string): string {
  // Remove dollar wrappers around content once fractions are converted
  return input.replace(/\$/g, '')
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

function simplifyToUnicode(aStr: string, bStr: string): string {
  let a = parseInt(aStr, 10)
  let b = parseInt(bStr, 10)
  if (!isFinite(a) || !isFinite(b) || b === 0) return `${aStr}/${bStr}`
  const sign = (a < 0) !== (b < 0) ? '-' : ''
  a = Math.abs(a); b = Math.abs(b)
  const g = gcd(a, b)
  const na = a / g
  const nb = b / g
  const key = `${na}/${nb}`
  if (FRACTION_MAP[key]) return `${sign}${FRACTION_MAP[key]}`
  return `${sign}${na}\u2044${nb}` // use fraction slash
}

function replaceLatexFractions(input: string): string {
  return input.replace(/\\frac\{\s*(-?\d{1,2})\s*\}\{\s*(\d{1,2})\s*\}/g, (_m, a: string, b: string) => simplifyToUnicode(a, b))
}

function replacePlainFractions(input: string): string {
  // Match standalone simple numeric fractions (avoid parts of larger numbers like 2024/10/26)
  return input.replace(/\b(-?\d{1,2})\s*\/\s*(\d{1,2})\b/g, (_m, a: string, b: string) => simplifyToUnicode(a, b))
}

function replaceMultiplicationX(input: string): string {
  // Replace a standalone x between spaces with ×
  return input.replace(/\s+x\s+/g, ' × ')
}

function toPrettyMath(input: string): string {
  let out = input
  // 1) Convert LaTeX \frac{a}{b} first
  out = replaceLatexFractions(out)
  // 2) Convert wrapped LaTeX by stripping $ now that fractions are converted
  out = normalizeDollarDelimiters(out)
  // 3) Convert plain text fractions
  out = replacePlainFractions(out)
  // 4) Replace multiplication marker
  out = replaceMultiplicationX(out)
  return out
}

export function MathRenderer({ text, displayMode = false, className = "" }: MathRendererProps) {
  const pretty = React.useMemo(() => toPrettyMath(text), [text])

  if (displayMode) {
    return <div className={className}>{pretty}</div>
  }
  return <span className={className}>{pretty}</span>
}

export default MathRenderer
