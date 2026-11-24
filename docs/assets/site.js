// Copy buttons, and previous/next buttons for the slide strips on devices with a mouse.
// The page works without this script: the strips scroll and the commands can be selected.

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Select to copy';
    }
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  });
}

const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

for (const strip of document.querySelectorAll('[data-strip]')) {
  const track = strip.querySelector('.strip-track');
  const nav = document.createElement('div');
  nav.className = 'strip-nav';

  const buttons = [
    [-1, 'Previous slides'],
    [1, 'Next slides'],
  ].map(([direction, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.innerHTML = arrow;
    button.addEventListener('click', () => {
      track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: smooth() });
    });
    nav.append(button);
    return button;
  });

  const update = () => {
    buttons[0].disabled = track.scrollLeft < 4;
    buttons[1].disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
  };
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  strip.append(nav);
  update();
}
