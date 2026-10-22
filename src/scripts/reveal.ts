const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let cleanup = () => {};

function setupPage() {
  cleanup();
  const controller = new AbortController();
  const animations: Animation[] = [];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reducedMotion.matches) {
        animations.push(entry.target.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' },
        ));
      }
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

  const stopAnimations = () => {
    if (reducedMotion.matches) animations.forEach(animation => animation.cancel());
  };
  reducedMotion.addEventListener('change', stopAnimations, { signal: controller.signal });
  cleanup = () => {
    controller.abort();
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
  };
}

document.addEventListener('astro:page-load', setupPage);
document.addEventListener('astro:before-swap', () => cleanup());
