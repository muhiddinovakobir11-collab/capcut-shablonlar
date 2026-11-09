/**
 * CapCut Rasmiy Web Portali
 * Muallif: Akobir (CapCut Creator)
 */

const DEFAULT_TEMPLATES = [
  {
    id: "tpl-ahmet-kaya",
    title: "Ahmet Kaya — Ritmik Montaj",
    creator: "Akobir",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    category: "Ahmet Kaya",
    duration: "0:25",
    clips: "2-5 ta klip/rasm",
    uses: "485.2K",
    likes: "42.8K",
    music: "Ahmet Kaya — Kum Gibi (Remix)",
    videoUrl: "./videos/sample1.mp4",
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    capcutUrl: "https://www.capcut.com/sv2/ZS9fkQmeNAKkc-r4Nyi/",
    isTrending: true
  },
  {
    id: "tpl-neon-beat",
    title: "Neon Beat Sync — TikTok Trend",
    creator: "Akobir",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    category: "Musiqa & Beat",
    duration: "0:15",
    clips: "7 ta fotosurat",
    uses: "890.4K",
    likes: "78.1K",
    music: "Phonk Beat — DRIFT VIP",
    videoUrl: "./videos/sample2.mp4",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    capcutUrl: "https://www.capcut.com",
    isTrending: true
  },
  {
    id: "tpl-slowmo-cinematic",
    title: "Cinematic Slow Motion 4K",
    creator: "Akobir",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    category: "Slow Motion",
    duration: "0:20",
    clips: "3 ta video",
    uses: "320.6K",
    likes: "29.4K",
    music: "Hans Zimmer Style — Epic Vibe",
    videoUrl: "./videos/sample3.mp4",
    posterUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    capcutUrl: "https://www.capcut.com",
    isTrending: false
  },
  {
    id: "tpl-love-lyrics",
    title: "Romantik Sevgi & Lirika",
    creator: "Akobir",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    category: "Sevgi & Lirika",
    duration: "0:30",
    clips: "8 ta fotosurat",
    uses: "610.9K",
    likes: "54.2K",
    music: "Sokin Sevgi Qo'shig'i (Acoustic)",
    videoUrl: "./videos/sample4.mp4",
    posterUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
    capcutUrl: "https://www.capcut.com",
    isTrending: true
  },
  {
    id: "tpl-birthday-party",
    title: "Tug'ilgan Kun Tabrigi (Party)",
    creator: "Akobir",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    category: "Foto Kollaj",
    duration: "0:18",
    clips: "6 ta rasm",
    uses: "215.0K",
    likes: "19.8K",
    music: "Happy Birthday Beat Remix",
    videoUrl: "./videos/sample5.mp4",
    posterUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80",
    capcutUrl: "https://www.capcut.com",
    isTrending: false
  },
  {
    id: "tpl-travel-vlog",
    title: "Sayohat & Mini Vlog Estetikasi",
    creator: "Akobir",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    category: "Trenddagilar",
    duration: "0:25",
    clips: "10 ta video/rasm",
    uses: "740.1K",
    likes: "65.7K",
    music: "Summer Chill Vibes (Lo-fi)",
    videoUrl: "./videos/sample6.mp4",
    posterUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80",
    capcutUrl: "https://www.capcut.com",
    isTrending: true
  }
];

let templatesData = [...DEFAULT_TEMPLATES];
let activeCategory = 'all';
let searchQuery = '';
let likedSet = new Set();

// DOM elementlar
const grid = document.getElementById('templates-grid');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const toast = document.getElementById('cc-toast');
const toastMsg = document.getElementById('cc-toast-msg');

// Modal elementlar
const modal = document.getElementById('cc-modal');
const modalBackdrop = document.getElementById('cc-modal-backdrop');
const modalClose = document.getElementById('cc-modal-close');
const modalVideo = document.getElementById('cc-modal-video');
const modalTitle = document.getElementById('cc-modal-title');
const modalCreatorName = document.getElementById('cc-modal-creator-name');
const modalCreatorAvatar = document.getElementById('cc-modal-creator-avatar');
const modalMusic = document.getElementById('cc-modal-music');
const modalClips = document.getElementById('cc-modal-clips');
const modalUses = document.getElementById('cc-modal-uses');
const modalCapcutBtn = document.getElementById('cc-modal-capcut-btn');
const modalShareBtn = document.getElementById('cc-modal-share-btn');
const modalQrImage = document.getElementById('cc-modal-qr');

function showToast(text) {
  if (!toast) return;
  toastMsg.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Ma'lumotlarni yuklash
async function loadData() {
  try {
    const res = await fetch('./data/templates.json?v=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        templatesData = data;
        renderFeed();
      }
    }
  } catch (e) {
    console.warn("Lokal ma'lumotlar bilan ishlanyapti:", e);
  }
}

// Lenta chizish
function renderFeed() {
  if (!grid) return;

  const filtered = templatesData.filter(t => {
    const matchCat = activeCategory === 'all' || 
                     (activeCategory === 'trending' ? t.isTrending : t.category === activeCategory);
    const matchQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (t.music && t.music.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(t => {
    const isLiked = likedSet.has(t.id);
    return `
      <article class="cc-card group" onclick="openModal('${t.id}')">
        <!-- 9:16 Video qismi -->
        <div class="cc-video-wrapper cursor-pointer">
          <video 
            src="${t.videoUrl}" 
            poster="${t.posterUrl || ''}" 
            muted 
            loop 
            playsinline 
            preload="metadata"
          ></video>

          <!-- Yuqori qatlam: Muallif va Foydalanishlar -->
          <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
            <div class="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <img src="${t.creatorAvatar}" class="w-4 h-4 rounded-full object-cover">
              <span class="text-[11px] font-semibold text-white/90">${t.creator}</span>
            </div>

            <div class="bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-medium text-white/90 flex items-center gap-1 border border-white/10">
              <svg class="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>${t.uses}</span>
            </div>
          </div>

          <!-- O'rtadagi Play nishoni -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>

          <!-- Pastki o'ng: Davomiylik -->
          <div class="absolute bottom-2.5 right-2.5 pointer-events-none">
            <span class="bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-300">
              ${t.duration}
            </span>
          </div>
        </div>

        <!-- Pastki qism: Sarlavha, Musiqa va Tugmalar -->
        <div class="cc-card-footer flex flex-col justify-between flex-grow">
          <div>
            <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
              ${t.title}
            </h3>
            <p class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 truncate">
              <svg class="w-3 h-3 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
              <span class="truncate">${t.music || 'Original Sound'}</span>
            </p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
            <!-- Like -->
            <button onclick="handleLike(event, '${t.id}')" class="flex items-center gap-1 text-[11px] ${isLiked ? 'text-pink-500 font-bold' : 'text-zinc-400 hover:text-white'} transition">
              <svg class="w-3.5 h-3.5 ${isLiked ? 'fill-current' : 'fill-none stroke-current'}" viewBox="0 0 24 24" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>${t.likes}</span>
            </button>

            <!-- CapCut'da ochish -->
            <a 
              href="${t.capcutUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              onclick="event.stopPropagation();"
              class="cc-btn-primary px-3 py-1 text-[11px] flex items-center gap-1 shadow-sm"
            >
              <span>CapCut'da ochish</span>
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  attachHoverPlay();
}

function attachHoverPlay() {
  const cards = document.querySelectorAll('.cc-card');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

window.handleLike = function(e, id) {
  e.stopPropagation();
  if (likedSet.has(id)) {
    likedSet.delete(id);
    showToast("Yoqtirish bekor qilindi");
  } else {
    likedSet.add(id);
    showToast("Sevimlilarga saqlandi! ❤️");
  }
  renderFeed();
};

window.openModal = function(id) {
  const t = templatesData.find(item => item.id === id);
  if (!t || !modal) return;

  modalTitle.textContent = t.title;
  modalCreatorName.textContent = t.creator;
  modalCreatorAvatar.src = t.creatorAvatar;
  modalMusic.textContent = t.music || "Original Sound";
  modalClips.textContent = `${t.clips} talab qilinadi`;
  modalUses.textContent = `${t.uses} marta ishlatildi`;
  modalCapcutBtn.href = t.capcutUrl;

  // QR kod yaratish (Telefon bilan skanerlab ochish uchun)
  if (modalQrImage) {
    modalQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(t.capcutUrl)}`;
  }

  modalShareBtn.onclick = () => {
    navigator.clipboard.writeText(t.capcutUrl).then(() => {
      showToast("CapCut havolasi nusxalandi!");
    }).catch(() => {
      showToast("Nusxalandi!");
    });
  };

  modalVideo.src = t.videoUrl;
  modalVideo.currentTime = 0;
  modalVideo.play().catch(() => {});

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.src = '';
  }
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Qidiruv
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderFeed();
  });
}

// Kategoriya Chips
const chips = document.querySelectorAll('.cc-tag-chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeCategory = chip.getAttribute('data-cat');
    renderFeed();
  });
});

// Sidebar navigatsiyasi
const navItems = document.querySelectorAll('.cc-nav-item');
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const cat = item.getAttribute('data-cat') || 'all';
    activeCategory = cat;

    // chipsni ham moslash
    chips.forEach(c => {
      if (c.getAttribute('data-cat') === cat) {
        chips.forEach(other => other.classList.remove('active'));
        c.classList.add('active');
      }
    });

    renderFeed();
  });
});

renderFeed();
document.addEventListener('DOMContentLoaded', loadData);
