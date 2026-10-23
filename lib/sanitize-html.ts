import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "a",
  "address",
  "article",
  "aside",
  "blockquote",
  "br",
  "caption",
  "code",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
];

export function sanitizeShopifyHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ["class", "id"],
      a: ["href", "name", "rel", "target", "title"],
      img: ["alt", "height", "loading", "src", "title", "width"],
      ol: ["start"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs:
          attribs.target === "_blank"
            ? { ...attribs, rel: "noopener noreferrer" }
            : attribs,
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: attribs.loading ?? "lazy" },
      }),
    },
  });
}
