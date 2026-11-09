/**
 * CapCut Shablonlar Galereyasi
 * Muallif: Akobir
 */

// Boshlang'ich holat
let templatesData = [];
let activeCategory = 'all';
let searchQuery = '';

// DOM elementlar
const templatesGrid = document.getElementById('templates-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const totalCountBadge = document.getElementById('total-count-badge');
const emptyState = document.getElementById('empty-state');

// Modal elementlari
const templateModal = document.getElementById('template-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalDuration = document.getElementById('modal-duration');
const modalMediaCount = document.getElementById('modal-media-count');
const modalViews = document.getElementById('modal-views');
const modalDescription = document.getElementById('modal-description');
const modalCapcutLink = document.getElementById('modal-capcut-link');
const modalCopyLink = document.getElementById('modal-copy-link');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

/**
 * Toast xabarini ko'rsatish
 */
function showToast(message) {
  if (!toast) return;
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Ma'lumotlarni yuklash (data/templates.json dan yoki LocalStorage dan)
 */
async function loadTemplates() {
  try {
    const response = await fetch('./data/templates.json?v=' + Date.now());
    if (response.ok) {
      templatesData = await response.json();
      renderTemplates();
      return;
    }
  } catch (error) {
    console.warn("Fayldan yuklashda xatolik, mahalliy saqlangan ma'lumot tekshirilmoqda:", error);
  }

  // Agar admindan qo'shilgan mahalliy ma'lumot bo'lsa
  const localData = localStorage.getItem('capcut_custom_templates');
  if (localData) {
    try {
      templatesData = JSON.parse(localData);
      renderTemplates();
      return;
    } catch (e) {}
  }

  // Standart zaxira shablonlar
  templatesData = [
    {
      id: "template-ahmet-kaya",
      title: "Ahmet Kaya",
      description: "Akobir tomonidan tayyorlangan maxsus Ahmet Kaya musiqiy video montaj shabloni.",
      category: "Video",
      duration: "0:25",
      mediaCount: "1-5 ta rasm / video",
      views: "19.8K",
      tag: "Premyera",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-guitarist-playing-on-stage-42475-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      capcutUrl: "https://www.capcut.com/sv2/ZS9fkQmeNAKkc-r4Nyi/"
    }
      {
        id: "template-1",
        title: "Neon Beat Sync Reels",
        description: "Musiqa zarbasiga mos dinamik o'tishlar va neon effektlar. TikTok va Reels uchun a'lo darajada.",
        category: "Reels/TikTok",
        duration: "0:15",
        mediaCount: "7 ta rasm / video",
        views: "24.5K",
        tag: "Trend",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-dj-mixing-music-in-a-nightclub-43398-large.mp4",
        posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        capcutUrl: "https://www.capcut.com"
      },
      {
        id: "template-2",
        title: "Premium Mahsulot Reklamasi",
        description: "Kiyim, krossovka, parfyum yoki aksessuarlar sotuvi uchun estetik va qimmat ko'rinuvchi promo shablon.",
        category: "Reklama",
        duration: "0:20",
        mediaCount: "5 ta rasm / video",
        views: "18.2K",
        tag: "Ommabop",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-for-a-fashion-photoshoot-42460-large.mp4",
        posterUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
        capcutUrl: "https://www.capcut.com"
      },
      {
        id: "template-3",
        title: "Unutilmas To'y Lahzalari",
        description: "Yumshoq ranglar, romantik o'tishlar va sekinlashtirilgan effektli to'y va sevgi xotiralari.",
        category: "To'y",
        duration: "0:30",
        mediaCount: "8 ta rasm / video",
        views: "31.0K",
        tag: "Top",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-42861-large.mp4",
        posterUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
        capcutUrl: "https://www.capcut.com"
      },
      {
        id: "template-4",
        title: "Tug'ilgan Kun Tabrigi (Party)",
        description: "Salomlar, konfetti va yorqin ranglar bilan bezatilgan bayramona tabrik shabloni.",
        category: "Tug'ilgan kun",
        duration: "0:18",
        mediaCount: "6 ta rasm / video",
        views: "15.7K",
        tag: "Yangi",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-with-confetti-falling-and-people-dancing-42683-large.mp4",
        posterUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80",
        capcutUrl: "https://www.capcut.com"
      },
      {
        id: "template-5",
        title: "Cinematic Sayohat Vlogi",
        description: "Shahar ko'chalari, tabiat manzaralari va sayohat kadrlarini kino uslubida yig'ib beruvchi estetik shablon.",
        category: "Vlog",
        duration: "0:25",
        mediaCount: "10 ta rasm / video",
        views: "28.9K",
        tag: "Trend",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-walking-through-a-city-at-sunset-42670-large.mp4",
        posterUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80",
        capcutUrl: "https://www.capcut.com"
      },
      {
        id: "template-6",
        title: "Minimalist Foto Kollej",
        description: "Foto arxivingizdan eng sara lahzalarni bitta chiroyli ritm ostida ko'rsatib beruvchi zamonaviy slaydshou.",
        category: "Reels/TikTok",
        duration: "0:12",
        mediaCount: "12 ta fotosurat",
        views: "19.4K",
        tag: "Ommabop",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-taking-photos-with-a-smartphone-at-a-music-festival-42709-large.mp4",
        posterUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
        capcutUrl: "https://www.capcut.com"
      }
    ];
    renderTemplates();
  }
}

/**
 * Kartochkalarni HTML formatida chiqarish
 */
function renderTemplates() {
  if (!templatesGrid) return;

  const filtered = templatesData.filter(tpl => {
    const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (totalCountBadge) {
    totalCountBadge.textContent = `${filtered.length} ta shablon`;
  }

  if (filtered.length === 0) {
    templatesGrid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  templatesGrid.innerHTML = filtered.map(tpl => {
    return `
      <article class="template-card group flex flex-col justify-between" data-id="${tpl.id}">
        <!-- Video qismi (9:16) -->
        <div class="video-container relative cursor-pointer" onclick="openModal('${tpl.id}')">
          <video 
            src="${tpl.videoUrl}" 
            poster="${tpl.posterUrl || ''}" 
            muted 
            loop 
            playsinline 
            preload="metadata"
            class="card-video"
          ></video>
          
          <!-- Play Badge -->
          <div class="play-badge shadow-lg">
            <svg class="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>

          <!-- Yuqori teglari -->
          <div class="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
            <span class="badge-tag px-3 py-1 rounded-full text-xs font-semibold text-white tracking-wide shadow-sm">
              ${tpl.category}
            </span>
            ${tpl.tag ? `
              <span class="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md">
                ${tpl.tag}
              </span>
            ` : ''}
          </div>

          <!-- Pastki video ma'lumotlari (davomiyligi) -->
          <div class="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
            <div class="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-white/90 flex items-center gap-1.5 font-medium">
              <svg class="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${tpl.duration || '0:15'}</span>
            </div>
            <div class="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-white/90 flex items-center gap-1.5 font-medium">
              <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>${tpl.views || '10K+'}</span>
            </div>
          </div>
        </div>

        <!-- Matn va Tugmalar qismi -->
        <div class="p-5 flex flex-col flex-grow justify-between bg-slate-900/40">
          <div>
            <h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              ${tpl.title}
            </h3>
            <p class="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              ${tpl.description}
            </p>
          </div>

          <!-- Tugmalar -->
          <div class="mt-5 grid grid-cols-2 gap-2.5">
            <button 
              onclick="openModal('${tpl.id}')"
              class="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-xs sm:text-sm text-center border border-slate-700/60 transition flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>Ko'rish</span>
            </button>
            
            <a 
              href="${tpl.capcutUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-2.5 px-3 rounded-xl capcut-gradient-btn text-white font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              <span>CapCut</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Hover video autoplay hodisalari
  attachVideoHoverListeners();
}

/**
 * Hover paytida video avtomatik o'ynalishi
 */
function attachVideoHoverListeners() {
  const cards = document.querySelectorAll('.template-card');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-playing');
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-playing');
      video.pause();
      video.currentTime = 0;
    });
  });

  // Mobil qurilmalarda ko'rinib turgan videoni avtomatik o'ynatish (IntersectionObserver)
  if ('IntersectionObserver' in window && window.innerWidth <= 768) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting) {
          entry.target.classList.add('is-playing');
          video.play().catch(() => {});
        } else {
          entry.target.classList.remove('is-playing');
          video.pause();
        }
      });
    }, { threshold: 0.65 });

    cards.forEach(card => observer.observe(card));
  }
}

/**
 * Shablon tafsilot modalini ochish
 */
function openModal(templateId) {
  const tpl = templatesData.find(item => item.id === templateId);
  if (!tpl || !templateModal) return;

  modalTitle.textContent = tpl.title;
  modalCategory.textContent = tpl.category;
  modalDuration.textContent = tpl.duration || '0:15';
  modalMediaCount.textContent = tpl.mediaCount || "5-8 ta rasm/video";
  modalViews.textContent = tpl.views || '15K+';
  modalDescription.textContent = tpl.description;
  
  modalCapcutLink.href = tpl.capcutUrl;
  
  // Nusxa olish tugmasi
  modalCopyLink.onclick = () => {
    navigator.clipboard.writeText(tpl.capcutUrl).then(() => {
      showToast("CapCut havolasi nusxalandi!");
    }).catch(() => {
      showToast("Nusxalashda xatolik yuz berdi");
    });
  };

  // Video manzilini yuklash
  modalVideo.src = tpl.videoUrl;
  modalVideo.poster = tpl.posterUrl || '';
  modalVideo.currentTime = 0;
  modalVideo.play().catch(() => {});

  // Modalni ko'rsatish
  templateModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Modalni yopish
 */
function closeModal() {
  if (!templateModal) return;
  templateModal.classList.add('hidden');
  document.body.style.overflow = '';
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.src = '';
  }
}

// Modal tinglovchilari
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && templateModal && !templateModal.classList.contains('hidden')) {
    closeModal();
  }
});

// Qidiruv maydoni
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTemplates();
  });
}

// Kategoriya filtrlash
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active', 'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'text-white'));
    btn.classList.add('active');
    activeCategory = btn.getAttribute('data-category');
    renderTemplates();
  });
});

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
  loadTemplates();
});
