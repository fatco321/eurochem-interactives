if (window.parent !== window) {
  const card = document.querySelector('.memo-card');
  const sendHeight = () => window.parent.postMessage({
    type: 'lesson-reference-height',
    height: Math.ceil(card.getBoundingClientRect().height),
  }, '*');
  new ResizeObserver(sendHeight).observe(card);
}
