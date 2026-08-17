// ===== Universal Big Image Lightbox Modal =====

export function initLightbox() {
  if (document.getElementById('nexusImageLightbox')) return;

  const lightboxHtml = `
    <div id="nexusImageLightbox" class="fixed inset-0 z-[300] hidden flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-300 p-4 select-none">
      <!-- Close Button -->
      <button id="closeLightboxBtn" class="absolute top-6 right-6 p-3 rounded-2xl bg-nexus-800/80 hover:bg-nexus-700 text-gray-300 hover:text-white border border-white/10 transition-all z-20 shadow-2xl" aria-label="Close Lightbox">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <!-- Lightbox Header Info -->
      <div class="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <span id="lightboxCategory" class="text-[10px] font-mono font-bold text-cyan-accent uppercase tracking-widest block">Nexus Arsenal</span>
          <h3 id="lightboxTitle" class="text-lg font-heading font-bold text-white leading-tight">Product Preview</h3>
        </div>
      </div>

      <!-- Main Image Container -->
      <div class="relative max-w-4xl max-h-[82vh] w-full flex items-center justify-center p-4">
        <div class="relative group flex items-center justify-center">
          <div class="absolute inset-0 bg-cyan-accent/10 blur-[100px] rounded-full"></div>
          <img id="lightboxImg" src="" alt="Product Big View" class="relative max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300 scale-95" />
        </div>
      </div>

      <!-- Lightbox Bottom Actions -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-5 py-2.5 rounded-full bg-nexus-800/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button id="lightboxZoomIn" class="p-2 text-gray-300 hover:text-cyan-accent transition-colors" title="Zoom In">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path></svg>
        </button>
        <span class="text-xs font-mono text-gray-400">|</span>
        <button id="lightboxZoomOut" class="p-2 text-gray-300 hover:text-cyan-accent transition-colors" title="Zoom Out">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg>
        </button>
        <span class="text-xs font-mono text-gray-400">|</span>
        <button id="lightboxDetailsBtn" class="text-xs font-semibold text-cyan-accent hover:underline flex items-center gap-1.5 px-2">
          <span>View Full Specifications</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', lightboxHtml);

  const modal = document.getElementById('nexusImageLightbox');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const img = document.getElementById('lightboxImg');
  const zoomIn = document.getElementById('lightboxZoomIn');
  const zoomOut = document.getElementById('lightboxZoomOut');
  let currentZoom = 1;

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentZoom = 1;
    img.style.transform = `scale(${currentZoom})`;
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  zoomIn.addEventListener('click', () => {
    currentZoom = Math.min(2.5, currentZoom + 0.25);
    img.style.transform = `scale(${currentZoom})`;
  });

  zoomOut.addEventListener('click', () => {
    currentZoom = Math.max(0.75, currentZoom - 0.25);
    img.style.transform = `scale(${currentZoom})`;
  });
}

export function openLightbox(imageSrc, title = 'Gaming Hardware', category = 'Nexus Gear', productId = '') {
  initLightbox();
  const modal = document.getElementById('nexusImageLightbox');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const catEl = document.getElementById('lightboxCategory');
  const detailsBtn = document.getElementById('lightboxDetailsBtn');

  if (!modal || !img) return;

  img.src = imageSrc;
  img.alt = title;
  titleEl.textContent = title;
  catEl.textContent = category;

  if (productId) {
    detailsBtn.style.display = 'flex';
    detailsBtn.onclick = () => {
      window.location.href = `/product-details.html?id=${productId}`;
    };
  } else {
    detailsBtn.style.display = 'none';
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Smooth scale-in transition
  img.style.transform = 'scale(0.85)';
  setTimeout(() => {
    img.style.transform = 'scale(1)';
  }, 50);
}

// Global window registration
if (typeof window !== 'undefined') {
  window.nexusOpenLightbox = openLightbox;
}
