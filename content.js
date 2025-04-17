(function () {
    const elements = document.querySelectorAll('body *');
    const output = [];
  
    elements.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
  
      if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden') return;
  
      const data = {
        type: tag === 'img' ? 'image' : 'text',
        tag: tag,
        content: tag === 'img' ? null : el.innerText.trim(),
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
  
      output.push(data);
    });
  
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'figma-export.json';
    a.click();
  })();
  