/**
 * Normalizes LaTeX math, unparsed delimiters, raw symbols, and headings
 * into clean, readable textbook-quality Unicode and Markdown.
 */

// Core symbol dictionary for converting LaTeX math tokens to clean Unicode
export function replaceMathSymbols(str: string): string {
  if (!str) return '';
  return str
    // Normalize double-escaped backslashes inside math expressions
    .replace(/\\\\([()[\]{}a-zA-Z]+)/g, '\\$1')
    // Complexity notations: \mathcal{O}(n) -> O(n), \mathcal{O} -> O, \mathcal{o} -> o
    .replace(/\\mathcal\{O\}\(([^)]+)\)/g, 'O($1)')
    .replace(/\\mathcal\{O\}/g, 'O')
    .replace(/\\mathcal\{o\}\(([^)]+)\)/g, 'o($1)')
    .replace(/\\mathcal\{([A-Za-z])\}/g, '$1')
    .replace(/\\mathcal\s*([A-Za-z])/g, '$1')
    // Text formatting inside math
    .replace(/\\mathbf\{([^}]+)\}/g, '**$1**')
    .replace(/\\mathit\{([^}]+)\}/g, '*$1*')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\mathsf\{([^}]+)\}/g, '$1')
    .replace(/\\texttt\{([^}]+)\}/g, '`$1`')
    // Brackets and delimiters
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\left\\\{/g, '{')
    .replace(/\\right\\\}/g, '}')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    // Inequalities and comparisons
    .replace(/\\leq|\\le/g, '≤')
    .replace(/\\geq|\\ge/g, '≥')
    .replace(/\\neq|\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\equiv/g, '≡')
    // Arithmetic & operators
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\mp/g, '∓')
    // Arrows & relations
    .replace(/\\rightarrow|\\to/g, '→')
    .replace(/\\leftarrow|\\gets/g, '←')
    .replace(/\\leftrightarrow/g, '↔')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\Leftarrow/g, '⇐')
    .replace(/\\Leftrightarrow/g, '⇔')
    // Math symbols
    .replace(/\\infty/g, '∞')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑($1 to $2)')
    .replace(/\\sum/g, '∑')
    .replace(/\\prod/g, '∏')
    .replace(/\\int/g, '∫')
    // Sets and logic
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\subseteq/g, '⊆')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    .replace(/\\forall/g, '∀')
    .replace(/\\exists/g, '∃')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\land/g, '∧')
    .replace(/\\lor/g, '∨')
    .replace(/\\neg/g, '¬')
    // Greek letters commonly used in CS & math
    .replace(/\\Theta/g, 'Θ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\omega/g, 'ω')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\pi/g, 'π')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\mu/g, 'μ')
    // Logarithms
    .replace(/\\log_2/g, 'log₂')
    .replace(/\\log_\{2\}/g, 'log₂')
    .replace(/\\log_10/g, 'log₁₀')
    .replace(/\\log_\{10\}/g, 'log₁₀')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    // Roots and fractions
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    // Common superscripts
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^n\b/g, 'ⁿ')
    .replace(/\^k\b/g, 'ᵏ')
    .replace(/\^0\b/g, '⁰')
    .replace(/\^1\b/g, '¹')
    .replace(/\^t\b/g, 'ᵗ')
    .replace(/\^x\b/g, 'ˣ')
    // Common subscripts
    .replace(/_1\b/g, '₁')
    .replace(/_2\b/g, '₂')
    .replace(/_0\b/g, '₀')
    .replace(/_n\b/g, 'ₙ')
    .replace(/_i\b/g, 'ᵢ')
    .replace(/_j\b/g, 'ⱼ')
    .replace(/_k\b/g, 'ₖ')
    // LaTeX space commands
    .replace(/\\quad/g, '  ')
    .replace(/\\qquad/g, '    ')
    .replace(/\\ /g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\,/g, ' ');
}

export function normalizeAcademicMarkdown(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // 1. Protect code blocks (fenced ```...``` and inline `...`) from symbol substitution
  const codeBlocks: string[] = [];
  text = text.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // 2. Normalize headings without spacing: e.g. "##Definition" -> "## Definition"
  text = text.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

  // 3. Normalize double-escaped backslashes before LaTeX tokens and delimiters outside code
  text = text
    .replace(/\\\\([()[\]{}])/g, '\\$1')
    .replace(/\\\\([a-zA-Z]+)/g, '\\$1');

  // 4. Process Display LaTeX: $$ ... $$ and \[ ... \]
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const cleaned = replaceMathSymbols(inner.trim());
    return `\n\n> **Formula / Relation:** \`${cleaned}\`\n\n`;
  });

  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => {
    const cleaned = replaceMathSymbols(inner.trim());
    return `\n\n> **Formula / Relation:** \`${cleaned}\`\n\n`;
  });

  // 5. Process Inline LaTeX: \( ... \)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => {
    return replaceMathSymbols(inner.trim());
  });

  // 6. Process Inline LaTeX: $ ... $ (requiring non-space after opening and before closing $)
  text = text.replace(/\$([^\$\s\n][^\$\n]*?[^\$\s\n]|\S)\$/g, (match, inner) => {
    const trimmed = inner.trim();
    // Preserve currency values like $25, $25.00, $100k, $5M, $10 USD
    if (/^\d+(?:[.,]\d+)?(?:\s*(?:k|M|B|USD|EUR|cents|dollars|million|billion))?$/.test(trimmed)) {
      return match;
    }
    // Only convert if it actually contains LaTeX tokens, operators, or single variable/math expression
    if (/[\\_^=+\-*/<>≤≥→{}|~]/.test(trimmed) || /^[a-zA-Z]$/.test(trimmed)) {
      return replaceMathSymbols(trimmed);
    }
    return match;
  });

  // 7. Clean any lingering standalone LaTeX symbols outside math delimiters
  text = replaceMathSymbols(text);

  // 8. Ensure clean definition callouts for academic definitions
  text = text.replace(/^(\*{0,2}Definition:\*{0,2})\s+/gm, '**Definition:** ');

  // 9. Restore protected code blocks
  text = text.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => {
    return codeBlocks[parseInt(idx, 10)] || '';
  });

  return text;
}
