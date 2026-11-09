/**
 * CapCut Rasmiy Uslubidagi Shablonlar Portali
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
let likedTemplates = new Set();

// DOM elementlar
const templatesGrid = document.getElementById('templates-grid');
const searchInput = document.getElementById('search-input');
const chipsContainer = document.getElementById('chips-container');
const emptyState = document.getElementById('empty-state');

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

// Toast
const toast = document.getElementById('cc-toast');
const toastMessage = document.getElementById('cc-toast-msg');

function showToast(msg) {
  if (!toast) return;
  toastMessage.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Ma'lumotlarni yuklash
async function loadTemplates() {
  try {
    const res = await fetch('./data/templates.json?v=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        templatesData = data;
        renderTemplates();
      }
    }
  } catch (e) {
    console.warn("Fayldan yuklashda zaxira ishlatildi:", e);
  }
}

// Kartochkalarni chizish
function renderTemplates() {
  if (!templatesGrid) return;

  const filtered = templatesData.filter(tpl => {
    const matchesCat = activeCategory === 'all' || 
                       (activeCategory === 'trending' ? tpl.isTrending : tpl.category === activeCategory);
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tpl.music && tpl.music.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    templatesGrid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  templatesGrid.innerHTML = filtered.map(tpl => {
    const isLiked = likedTemplates.has(tpl.id);
    return `
      <article class="cc-template-card group flex flex-col justify-between" data-id="${tpl.id}">
        
        <!-- Video konteyner (Telefonda 9:16, Kompyuterda 16:9) -->
        <div class="cc-video-box relative cursor-pointer" onclick="openTemplateModal('${tpl.id}')">
          <video 
            src="${tpl.videoUrl}" 
            poster="${tpl.posterUrl || ''}" 
            muted 
            loop 
            playsinline 
            preload="metadata"
          ></video>

          <!-- Yuqori qatlam: Trending belgisi va Foydalanishlar soni -->
          <div class="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10 pointer-events-none">
            ${tpl.isTrending ? `
              <span class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow">
                Trend 🔥
              </span>
            ` : `
              <span class="bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10">
                ${tpl.category}
              </span>
            `}

            <div class="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium text-white/90 flex items-center gap-1 border border-white/10">
              <svg class="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>${tpl.uses}</span>
            </div>
          </div>

          <!-- O'rtadagi Play nishoni -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          <!-- Pastki o'ng taraf: Video vaqti -->
          <div class="absolute bottom-2.5 right-2.5 pointer-events-none">
            <span class="bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white/90">
              ${tpl.duration}
            </span>
          </div>
        </div>

        <!-- Pastki axborot va harakatlar qismi -->
        <div class="p-3.5 flex flex-col justify-between flex-grow bg-[#141418]">
          <div>
            <h3 class="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
              ${tpl.title}
            </h3>

            <!-- Muallif va Musiqa -->
            <div class="flex items-center gap-2 mt-2">
              <img src="${tpl.creatorAvatar}" alt="${tpl.creator}" class="w-5 h-5 rounded-full object-cover border border-white/20">
              <span class="text-xs text-zinc-300 font-medium">${tpl.creator}</span>
              <span class="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span class="text-[11px] text-zinc-400 truncate max-w-[120px]">${tpl.clips}</span>
            </div>
          </div>

          <!-- Pastki tugmalar qatori -->
          <div class="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-white/5">
            <!-- Like tugmasi -->
            <button 
              onclick="toggleLike(event, '${tpl.id}')" 
              class="flex items-center gap-1.5 text-xs ${isLiked ? 'text-pink-500 font-bold' : 'text-zinc-400 hover:text-white'} transition"
            >
              <svg class="w-4 h-4 ${isLiked ? 'fill-current' : 'fill-none stroke-current'}" viewBox="0 0 24 24" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>${tpl.likes}</span>
            </button>

            <!-- CapCut'da ochish tugmasi -->
            <a 
              href="${tpl.capcutUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="cc-btn-white px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm"
              onclick="event.stopPropagation();"
            >
              <span>Shablonni ochish</span>
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>

        </div>

      </article>
    `;
  }).join('');

  attachVideoHover();
}

// Hover video ijrosi
function attachVideoHover() {
  const cards = document.querySelectorAll('.cc-template-card');
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

// Like bosish
window.toggleLike = function(e, id) {
  e.stopPropagation();
  if (likedTemplates.has(id)) {
    likedTemplates.delete(id);
    showToast("Yoqtirish bekor qilindi");
  } else {
    likedTemplates.add(id);
    showToast("Sevimlilarga qo'shildi! ❤️");
  }
  renderTemplates();
};

// Modal ochish
window.openTemplateModal = function(id) {
  const tpl = templatesData.find(t => t.id === id);
  if (!tpl || !modal) return;

  modalTitle.textContent = tpl.title;
  modalCreatorName.textContent = tpl.creator;
  modalCreatorAvatar.src = tpl.creatorAvatar;
  modalMusic.textContent = tpl.music || "Original Sound";
  modalClips.textContent = tpl.clips;
  modalUses.textContent = `${tpl.uses} marta ishlatildi`;
  modalCapcutBtn.href = tpl.capcutUrl;

  modalShareBtn.onclick = () => {
    navigator.clipboard.writeText(tpl.capcutUrl).then(() => {
      showToast("CapCut havolasi nusxalandi!");
    }).catch(() => {
      showToast("Nusxalandi!");
    });
  };

  modalVideo.src = tpl.videoUrl;
  modalVideo.currentTime = 0;
  modalVideo.play().catch(() => {});

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

// Modal yopish
function closeTemplateModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.src = '';
  }
}

if (modalClose) modalClose.addEventListener('click', closeTemplateModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeTemplateModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeTemplateModal();
  }
});

// Qidiruv
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTemplates();
  });
}

// Kategoriya Chips
if (chipsContainer) {
  const chips = chipsContainer.querySelectorAll('.cc-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-cat');
      renderTemplates();
    });
  });
}

// Obuna bo'lish tugmasi
const followBtn = document.getElementById('follow-creator-btn');
if (followBtn) {
  let isFollowed = false;
  followBtn.addEventListener('click', () => {
    isFollowed = !isFollowed;
    if (isFollowed) {
      followBtn.textContent = "Obuna bo'lindi ✓";
      followBtn.classList.replace('cc-btn-white', 'cc-btn-dark');
      showToast("Akobir profiliga obuna bo'ldingiz!");
    } else {
      followBtn.textContent = "Obuna bo'lish +";
      followBtn.classList.replace('cc-btn-dark', 'cc-btn-white');
    }
  });
}

// Boshlash
renderTemplates();
document.addEventListener('DOMContentLoaded', loadTemplates);
