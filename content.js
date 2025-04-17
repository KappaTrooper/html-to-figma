(function () {
  console.log("Extracting page layout...");

  const container = document.querySelector('.main') || document.body;
  const elements = container.querySelectorAll('*');

  const allowedTags = ['div', 'p', 'h1', 'h2', 'h3', 'span', 'img', 'button', 'a', 'section', 'main', 'article'];
  const groups = {};

  function getGroupKey(el) {
    const parent = el.parentElement;
    if (!parent) return 'ungrouped';
    return parent.tagName.toLowerCase() + (parent.className ? '.' + parent.className.trim().split(' ').join('.') : '');
  }

  elements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (!allowedTags.includes(tag)) return;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    if (
      rect.width === 0 ||
      rect.height === 0 ||
      style.display === 'none' ||
      style.visibility === 'hidden'
    ) return;

    const groupKey = getGroupKey(el);

    const data = {
      type: tag === 'img' ? 'image' : 'text',
      tag: tag,
      content: tag === 'img' ? null : (el.textContent || "").trim(),
      src: tag === 'img' ? el.src : null,
      position: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      },
      styles: {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.color,
        backgroundColor: style.backgroundColor,
        textAlign: style.textAlign,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
      },
    };

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(data);
  });

  const blob = new Blob([JSON.stringify(groups, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${safeTitle || 'figma_export'}.json`;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  a.remove();

  console.log("Download triggered with", Object.keys(groups).length, "group(s).");
})();
