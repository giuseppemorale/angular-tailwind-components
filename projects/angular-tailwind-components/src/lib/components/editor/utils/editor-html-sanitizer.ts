const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'blockquote',
  'pre',
  'code',
  'span',
  'div'
]);

const GLOBAL_ATTRS = new Set(['title', 'class']);
const ALLOWED_TEXT_ALIGN = new Set(['left', 'center', 'right', 'justify']);

const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height'])
};

function sanitizeTextAlignStyle(style: string): string | null {
  const match = style.match(/text-align\s*:\s*(left|center|right|justify)\b/i);
  if (!match) return null;
  const value = match[1].toLowerCase();
  if (!ALLOWED_TEXT_ALIGN.has(value)) return null;
  return `text-align: ${value}`;
}

function isSafeUrl(url: string, allowDataImage: boolean): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return false;
  if (allowDataImage && lower.startsWith('data:image/')) return true;
  return lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:');
}

function sanitizeElement(el: Element): void {
  const tag = el.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) {
    unwrapElement(el);
    return;
  }

  [...el.attributes].forEach(attr => {
    const name = attr.name.toLowerCase();
    if (name.startsWith('on')) {
      el.removeAttribute(attr.name);
      return;
    }
    if (name === 'style') {
      const safeStyle = sanitizeTextAlignStyle(attr.value);
      if (safeStyle) {
        el.setAttribute(attr.name, safeStyle);
      } else {
        el.removeAttribute(attr.name);
      }
      return;
    }
    const allowed = TAG_ATTRS[tag] ?? GLOBAL_ATTRS;
    if (!allowed.has(name)) {
      el.removeAttribute(attr.name);
      return;
    }
    if (name === 'href' && !isSafeUrl(attr.value, false)) {
      el.removeAttribute(attr.name);
    }
    if (name === 'src' && !isSafeUrl(attr.value, true)) {
      el.removeAttribute(attr.name);
    }
    if (name === 'target' && attr.value !== '_blank') {
      el.removeAttribute(attr.name);
    }
  });

  if (tag === 'a' && el.getAttribute('target') === '_blank') {
    el.setAttribute('rel', 'noopener noreferrer');
  }

  [...el.children].forEach(child => sanitizeElement(child));
}

function unwrapElement(el: Element): void {
  const parent = el.parentNode;
  if (!parent) {
    el.remove();
    return;
  }
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

/** Sanitize HTML string using a tag/attribute whitelist. */
export function sanitizeEditorHtml(html: string): string {
  if (!html?.trim()) return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  [...body.children].forEach(child => sanitizeElement(child));

  const result = body.innerHTML.trim();
  return result === '<br>' ? '' : result;
}
