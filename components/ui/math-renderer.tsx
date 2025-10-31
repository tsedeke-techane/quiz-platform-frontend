"use client"

import React from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// Development helper to catch undelimited math
const DEV = process.env.NODE_ENV === 'development'
const warnedAbout = new Set<string>()

// Common math macros for the quiz platform
const MATH_MACROS = {
  // Fractions with proper spacing
  '\\frac': '\\frac{#1}{#2}',
  // Vectors with arrows
  '\\vec': '\\vec{#1}',
  // Common differentials
  '\\d': '\\mathrm{d}',
  // Limit notation
  '\\lim': '\\lim_{#1}',
  // Integration with proper spacing
  '\\int': '\\int_{#1}^{#2}',
  // Sum notation
  '\\sum': '\\sum_{#1}^{#2}',
  // Common functions
  '\\sin': '\\sin',
  '\\cos': '\\cos',
  '\\tan': '\\tan',
  '\\ln': '\\ln',
  '\\log': '\\log',
}

interface MathRendererProps {
  /** The text to render, can contain math delimited by $...$ or $$...$$ */
  text: string
  /** When true, centers the math and uses display style (larger symbols) */
  displayMode?: boolean
  /** CSS class name for the container element */
  className?: string
  /** 
   * @deprecated Use proper LaTeX delimiters ($...$) instead
   * When true, tries to detect and convert plain math-like patterns
   */
  convertPlainMath?: boolean
  /**
   * When true, renders invalid LaTeX as red text instead of throwing
   * Defaults to true for better user experience
   */
  throwOnError?: boolean
  /** Custom KaTeX macros to use in addition to the default math macros */
  macros?: Record<string, string>
  /** When true, allows \color and similar commands. Defaults to true */
  strict?: boolean
  /** Optional max size for math expression. Defaults to 100 */
  maxSize?: number
  /** When true, allows equations to break across lines. Defaults to false */
  maxExpand?: number
}

function processMathContent(text: string): string {
  // Convert a few convenient plain patterns only inside math segments
  return text
    // Convert plain fractions like 1/2 to LaTeX \frac{1}{2}
    .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, '\\frac{$1}{$2}')
    // Convert multiplication x to \times when written as space-surrounded x
    .replace(/\s+x\s+/g, ' \\times ')
    // Normalize ^n to ^{n}
    .replace(/\^(\d+)/g, '^{ $1 }'.replace(/\s+/g, ''))
    // Convert sqrt(x) -> \\sqrt{x}
    .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'inline'; content: string }
  | { type: 'display'; content: string }

function splitIntoSegments(input: string): Segment[] {
  // Match $$...$$, $...$, \[ ... \], \( ... \)
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$]+\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g
  const segments: Segment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: input.slice(lastIndex, match.index) })
    }

    const m = match[0]
    if (m.startsWith('$$') && m.endsWith('$$')) {
      segments.push({ type: 'display', content: m.slice(2, -2) })
    } else if (m.startsWith('$') && m.endsWith('$')) {
      segments.push({ type: 'inline', content: m.slice(1, -1) })
    } else if (m.startsWith('\\[') && m.endsWith('\\]')) {
      segments.push({ type: 'display', content: m.slice(2, -2) })
    } else if (m.startsWith('\\(') && m.endsWith('\\)')) {
      segments.push({ type: 'inline', content: m.slice(2, -2) })
    } else {
      // Fallback treat as text
      segments.push({ type: 'text', content: m })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', content: input.slice(lastIndex) })
  }

  return segments
}

type PlainPart = { type: 'text'; content: string } | { type: 'math'; content: string }

function splitPlainMathSegments(input: string): PlainPart[] {
  // Very small heuristic regex to find plain math-like substrings inside text.
  const mathRegex = /(?:(?:\b\d*\.\d+\b)|(?:\b(?:\d+\s*[+\-*/×÷]\s*)+\d+\b)|(?:\b\w+\^\d+\b)|(?:sqrt\([^)]+\))|(?:\b(?:sin|cos|tan|log|ln)\b)|(?:\b[a-z]\s*(?:[+\-*/×÷]\s*[a-z0-9]+)+\b)|(?:\b[a-z]\s*=\s*[-+]?\d+(?:\.\d+)?\b))/gi
  const parts: PlainPart[] = []
  let lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = mathRegex.exec(input)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ type: 'text', content: input.slice(lastIndex, m.index) })
    }
    parts.push({ type: 'math', content: m[0] })
    lastIndex = mathRegex.lastIndex
  }

  if (lastIndex < input.length) {
    parts.push({ type: 'text', content: input.slice(lastIndex) })
  }

  return parts
}

export function MathRenderer({ 
  text,
  displayMode = false,
  className = '',
  convertPlainMath = true,
  throwOnError = false,
  macros = {},
  strict = false,
  maxSize = 100,
  maxExpand = 1000
}: MathRendererProps) {
  // Merge user macros with our default math macros
  const mergedMacros = React.useMemo(
    () => ({ ...MATH_MACROS, ...macros }),
    [macros]
  )

  // Common KaTeX options
  const katexOptions = React.useMemo(() => ({
    throwOnError,
    strict,
    maxSize,
    maxExpand,
    macros: mergedMacros,
    displayMode // This affects the size/style of math operators
  }), [throwOnError, strict, maxSize, maxExpand, mergedMacros, displayMode])

  React.useEffect(() => {
    if (DEV && convertPlainMath && !warnedAbout.has(text)) {
      const hasMathWithoutDelimiters = /(?:[+\-*/×÷=]|\b(?:sin|cos|tan|log|ln)\b|\b[a-z]\s*=\s*\d|\b\d+[a-z]\b)/i.test(text)
      if (hasMathWithoutDelimiters) {
        console.warn(
          `[MathRenderer] Found potential undelimited math in: "${text}"\n` +
          'Consider wrapping math expressions in $...$ for consistent rendering.\n' +
          'Example: "Solve $2x + 5 = 13$" instead of "Solve 2x + 5 = 13"\n' +
          'Available features:\n' +
          ' - Inline math: $...$ or \\(...\\)\n' +
          ' - Display math: $$...$$ or \\[...\\]\n' +
          ' - Common functions: \\sin, \\cos, \\tan, \\log, \\ln\n' +
          ' - Fractions: \\frac{num}{den}\n' +
          ' - Powers: x^{2}, x^n\n' +
          ' - Roots: \\sqrt{x}, \\sqrt[n]{x}\n' +
          ' - Limits: \\lim_{x \\to 0}\n' +
          ' - Integrals: \\int_{a}^{b}\n' +
          ' - And more...'
        )
        warnedAbout.add(text)
      }
    }
  }, [text, convertPlainMath])
  const segments = React.useMemo(() => splitIntoSegments(text), [text])

  try {
    const nodes = segments.map((seg, i) => {
      if (seg.type === 'text') {
        // If caller disabled plain-math conversion, render raw text
        if (!convertPlainMath) {
          return (
            <span key={i}>{seg.content}</span>
          )
        }

        // Split plain text further into math-like parts and normal text.
        const plainParts = splitPlainMathSegments(seg.content)
        return (
          <React.Fragment key={i}>
            {plainParts.map((p, j) =>
              p.type === 'text' ? (
                <span key={j}>{p.content}</span>
              ) : (
                <InlineMath key={j} math={processMathContent(p.content)} errorColor="#cc0000" />
              ),
            )}
          </React.Fragment>
        )
      }

      const math = processMathContent(seg.content)

      if (seg.type === 'inline') {
        return (
          <InlineMath 
            key={i}
            math={math}
            errorColor="#cc0000"
            {...katexOptions}
          />
        )
      }

      // display
      return (
        <div key={i} className="my-2">
          <BlockMath
            math={math}
            errorColor="#cc0000"
            {...katexOptions}
          />
        </div>
      )
    })

    if (displayMode) {
      // In display mode prefer block layout for the whole piece
      return <div className={className}>{nodes}</div>
    }

    return <span className={className}>{nodes}</span>
  } catch (error) {
    console.error('Math rendering error:', error)
    return displayMode ? <div className={className}>{text}</div> : <span className={className}>{text}</span>
  }
}

export default MathRenderer
