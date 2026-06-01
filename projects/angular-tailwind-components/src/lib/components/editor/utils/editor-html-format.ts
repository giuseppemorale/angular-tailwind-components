const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** Indent HTML for the source (code) view (tags on separate lines, inline content kept compact). */
export function prettifyEditorHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed || !trimmed.includes('<')) return trimmed;

  const tokens = trimmed
    .replace(/>\s+</g, '><')
    .replace(/></g, '>\n<')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const lines: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    const isClosing = /^<\//.test(token);
    const isSelfClosing = /\/>$/.test(token);
    const openTag = /^<([a-z][\w-]*)/i.exec(token);
    const tag = openTag?.[1]?.toLowerCase();
    const voidTag = tag ? VOID_TAGS.has(tag) : false;

    if (isClosing) {
      depth = Math.max(0, depth - 1);
    }

    lines.push(`${'  '.repeat(depth)}${token}`);

    const closesInline = !isClosing && /<\/[a-z][\w-]*>/i.test(token);
    if (!isClosing && !isSelfClosing && !voidTag && tag && !closesInline) {
      depth++;
    }
  }

  return lines.join('\n');
}
