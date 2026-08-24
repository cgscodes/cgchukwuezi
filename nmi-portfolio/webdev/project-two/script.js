document.addEventListener('DOMContentLoaded', () => {
  // Keep the in-card 16x9, top-cropped preview crisp
  document.querySelectorAll('.screenshot .s-shot').forEach(img => {
    Object.assign(img.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'top center'
    });
  });

  // Build a reusable viewer overlay
  const backdrop = document.createElement('div');
  backdrop.className = 'viewer-backdrop';

  const viewer = document.createElement('div');
  viewer.className = 'viewer';

  const toolbar = document.createElement('div');
  toolbar.className = 'viewer-toolbar';

  const left = document.createElement('div');  left.className = 'left';
  const right = document.createElement('div'); right.className = 'right';

  const zoomOutBtn = btn('−', 'Zoom out');
  const zoomInBtn  = btn('+', 'Zoom in');
  const fitBtn     = btn('Fit', 'Fit to window');
  const scrollBtn  = btn('Scroll', 'Full-size scroll');
  const closeBtn   = btn('✕', 'Close');

  const zoomBadge = document.createElement('span');
  zoomBadge.className = 'zoom-badge';
  zoomBadge.textContent = '100%';

  left.append(zoomOutBtn, zoomInBtn, fitBtn, scrollBtn);
  right.append(zoomBadge, closeBtn);
  toolbar.append(left, right);

  const main = document.createElement('div');
  main.className = 'viewer-main';

  const img = document.createElement('img');
  img.className = 'viewer-img';
  main.appendChild(img);

  viewer.append(toolbar, main);
  document.body.append(backdrop, viewer);

  // State
  let mode = 'fit';   // 'fit' or 'scroll'
  let scale = 1;      // relative zoom when in 'scroll' mode (1 = natural size)
  let naturalW = 0, naturalH = 0;

  function btn(text, title) {
    const b = document.createElement('button');
    b.className = 'viewer-btn';
    b.textContent = text;
    b.title = title;
    return b;
  }

  function openViewer(src) {
    img.src = src;
    // Wait for natural size, then default to 'fit'
    img.onload = () => {
      naturalW = img.naturalWidth || img.width;
      naturalH = img.naturalHeight || img.height;
      setMode('fit');  // start with contain inside the viewer, no blur
      viewer.classList.add('show');
      backdrop.classList.add('show');
      // jump scroll to top for tall screenshots
      main.scrollTop = 0;
    };
  }

  function closeViewer() {
    viewer.classList.remove('show');
    backdrop.classList.remove('show');
  }

  function setMode(next) {
    mode = next;
    if (mode === 'fit') {
      // contain within the viewer area (no scroll)
      Object.assign(img.style, {
        maxWidth: '100%', maxHeight: '100%',
        width: 'auto', height: 'auto'
      });
      scale = currentFitPercent();   // sync zoomBadge to what user sees
      updateBadge();
      main.style.overflow = 'hidden';
    } else {
      // scroll mode: image at natural size * scale, scrollable
      Object.assign(img.style, {
        maxWidth: 'none', maxHeight: 'none',
        width: `${Math.round(naturalW * scale)}px`,
        height: 'auto'
      });
      main.style.overflow = 'auto';
      updateBadge();
    }
  }

  function currentFitPercent() {
    // compute how much the image is being reduced to fit
    const availW = main.clientWidth, availH = main.clientHeight;
    const wr = availW / naturalW;
    const hr = availH / naturalH;
    const fit = Math.min(wr, hr);
    return Math.max(1, Math.round(fit * 100)); // clamp min 100% display
  }

  function updateBadge() {
    const pct = mode === 'fit'
      ? currentFitPercent()
      : Math.round(scale * 100);
    zoomBadge.textContent = `${pct}%`;
  }

  function zoom(delta) {
    // if we're in 'fit', switch to 'scroll' first using the current displayed width as baseline
    if (mode === 'fit') {
      const baseline = (currentFitPercent() / 100);
      scale = baseline;
      setMode('scroll');
    }
    // apply zoom change
    const newScale = Math.min(6, Math.max(0.2, scale * (delta > 0 ? 1.2 : 1 / 1.2)));
    // keep the point under the center roughly steady
    const preCenterX = main.scrollLeft + main.clientWidth / 2;
    const preCenterY = main.scrollTop  + main.clientHeight / 2;

    scale = newScale;
    img.style.width = `${Math.round(naturalW * scale)}px`;
    img.style.height = 'auto';
    updateBadge();

    // adjust scroll to re-center
    const postCenterX = (preCenterX / (img.naturalWidth * (scale / (delta > 0 ? 1/1.2 : 1.2)))) * (img.naturalWidth * scale);
    main.scrollLeft = postCenterX - main.clientWidth / 2;
  }

  // Controls
  zoomInBtn.addEventListener('click',  () => zoom(+1));
  zoomOutBtn.addEventListener('click', () => zoom(-1));
  fitBtn.addEventListener('click',     () => setMode('fit'));
  scrollBtn.addEventListener('click',  () => {
    if (mode === 'scroll') setMode('fit'); else { scale = 1; setMode('scroll'); }
    main.scrollTop = 0;
  });
  closeBtn.addEventListener('click',   closeViewer);
  backdrop.addEventListener('click',   closeViewer);

  // Keyboard shortcuts inside viewer
  document.addEventListener('keydown', (e) => {
    if (!viewer.classList.contains('show')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === '+' || e.key === '=' ) zoom(+1);
    if (e.key === '-' || e.key === '_' ) zoom(-1);
    if (e.key === '0') setMode('fit');
    if (e.key.toLowerCase() === 's') { if (mode === 'scroll') setMode('fit'); else { scale = 1; setMode('scroll'); } }
  });

  // Open viewer on click of any screenshot
  document.querySelectorAll('.screenshot').forEach(box => {
    const shot = box.querySelector('.s-shot');
    if (!shot) return;
    box.addEventListener('click', () => openViewer(shot.currentSrc || shot.src));
    // Optional: hover open — uncomment if you want hover to open as well
    // box.addEventListener('mouseenter', () => openViewer(shot.currentSrc || shot.src));
    // box.addEventListener('mouseleave', closeViewer);
  });
});
