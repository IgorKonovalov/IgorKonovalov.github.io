/**
 * Wrap every markdown table in a horizontally scrollable container.
 *
 * A markdown table has no wrapper element of its own, and putting `overflow-x`
 * on the `<table>` itself would take it out of table layout. So a table wider
 * than the content column has nowhere to go and pushes the whole page sideways
 * on a phone. This adds the container the CSS needs.
 *
 * `tabindex="0"` is deliberate: a container that scrolls must be reachable by
 * keyboard, or the content past its right edge cannot be read without a mouse.
 */
export default function rehypeTableScroll() {
  return (tree) => wrapTables(tree);
}

function wrapTables(node) {
  if (!Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (child.type !== 'element') continue;

    if (child.tagName === 'table') {
      node.children[i] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], tabIndex: 0 },
        children: [child],
      };
      continue;
    }

    wrapTables(child);
  }
}
