/**
 * Resolve escape sequences in a string
 * @param escaped string with hex escape sequences
 */
export function unescape(escaped: string): string {
  const unescaped = escaped.replace(
    /%([0-9A-Fa-f]{2})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16)),
  ).replace(
    /%u([0-9A-Fa-f]{4})/g,
    (_, hex) => String.fromCharCode(parseInt(hex, 16)),
  ).replace(
    /%u{([0-9A-Fa-f]{1,6})}/g,
    ($, hex) => {
      const code = parseInt(hex, 16);
      if (code > 0x10FFFF) return $;
      return String.fromCodePoint(code);
    },
  );
  const nullCharIndex = unescaped.indexOf("\0");
  if (nullCharIndex > -1) return unescaped.slice(0, nullCharIndex);
  return unescaped;
}
