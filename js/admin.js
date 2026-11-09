/**
 * CapCut Shablonlar Boshqaruv Paneli (Admin)
 * Muallif: Akobir
 */

const ADMIN_PASSWORD = "akobircapcut";
let templates = [];
let editingId = null;

// DOM elementlar
const loginCard = document.getElementById('login-card');
const adminDashboard = document.getElementById('admin-dashboard');
const adminPassInput = document.getElementById('admin-password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const templatesTableBody = document.getElementById('templates-table-body');
const templateForm = document.getElementById('template-form');
const formTitle = document.getElementById('form-title');
const resetFormBtn = document.getElementById('reset-form-btn');
const exportJsonBtn = document.getElementById('export-json-btn');
const resetDefaultsBtn = document.getElementById('reset-defaults-btn');

// Form maydonlari
const inputTitle = document.getElementById('input-title');
const inputCategory = document.getElementById('input-category');
const inputDuration = document.getElementById('input-duration');
const inputMediaCount = document.getElementById('input-media-count');
const inputVideoUrl = document.getElementById('input-video-url');
const inputPosterUrl = document.getElementById('input-poster-url');
const inputCapcutUrl = document.getElementById('input-capcut-url');
const inputMusic = document.getElementById('input-music');

function checkAuth() {
  const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
  if (isAuth) {
    if (loginCard) loginCard.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    loadAdminTemplates();
  } else {
    if (loginCard) loginCard.classList.remove('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
  }
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    if (adminPassInput.value.trim() === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      loginError.classList.add('hidden');
      checkAuth();
    } else {
      loginError.classList.remove('hidden');
    }
  });
}

if (adminPassInput) {
  adminPassInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    checkAuth();
  });
}

async function loadAdminTemplates() {
  const localData = localStorage.getItem('capcut_custom_templates');
  if (localData) {
    templates = JSON.parse(localData);
    renderAdminList();
    return;
  }

  try {
    const res = await fetch('./data/templates.json');
    templates = await res.json();
    localStorage.setItem('capcut_custom_templates', JSON.stringify(templates));
    renderAdminList();
  } catch (e) {
    templates = [];
    renderAdminList();
  }
}

function renderAdminList() {
  if (!templatesTableBody) return;

  if (templates.length === 0) {
    templatesTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-8 text-center text-zinc-500 text-xs">
          Hozircha hech qanday shablon mavjud emas. Yangi shablon qo'shing.
        </td>
      </tr>
    `;
    return;
  }

  templatesTableBody.innerHTML = templates.map((tpl, index) => {
    return `
      <tr class="border-b border-white/5 hover:bg-zinc-900/40 transition">
        <td class="px-4 py-3 text-xs text-zinc-500">${index + 1}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <img src="${tpl.posterUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100'}" alt="${tpl.title}" class="w-10 h-14 object-cover rounded-lg border border-white/10">
            <div>
              <p class="font-bold text-white text-xs">${tpl.title}</p>
              <p class="text-[11px] text-zinc-400">🎵 ${tpl.music || 'Original Sound'}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/10">
            ${tpl.category}
          </span>
        </td>
        <td class="px-4 py-3 text-[11px] text-zinc-400">
          <p>⏳ ${tpl.duration || '0:15'}</p>
          <p>📷 ${tpl.clips || '3 ta klip'}</p>
        </td>
        <td class="px-4 py-3 text-[11px]">
          <a href="${tpl.capcutUrl}" target="_blank" class="text-cyan-400 hover:underline flex items-center gap-1 max-w-[150px] truncate">
            <span>CapCut'da ochish</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="editTemplate('${tpl.id}')" class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition">
              Tahrirlash
            </button>
            <button onclick="deleteTemplate('${tpl.id}')" class="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 text-xs border border-red-500/30 transition">
              O'chirish
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

if (templateForm) {
  templateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTemplate = {
      id: editingId || `tpl-${Date.now()}`,
      title: inputTitle.value.trim(),
      creator: "Akobir",
      creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      category: inputCategory.value,
      duration: inputDuration.value.trim() || "0:15",
      clips: inputMediaCount.value.trim() || "3 ta klip",
      uses: "12.4K",
      likes: "1.2K",
      music: (inputMusic && inputMusic.value.trim()) || "Original Sound",
      videoUrl: inputVideoUrl.value.trim(),
      posterUrl: inputPosterUrl.value.trim() || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600",
      capcutUrl: inputCapcutUrl.value.trim(),
      isTrending: true
    };

    if (editingId) {
      const idx = templates.findIndex(t => t.id === editingId);
      if (idx !== -1) templates[idx] = { ...templates[idx], ...newTemplate };
      editingId = null;
      formTitle.textContent = "Yangi shablon qo'shish";
    } else {
      templates.unshift(newTemplate);
    }

    saveAndRefresh();
    templateForm.reset();
    alert("Shablon muvaffaqiyatli saqlandi!");
  });
}

window.editTemplate = function(id) {
  const tpl = templates.find(t => t.id === id);
  if (!tpl) return;

  editingId = id;
  formTitle.textContent = `Tahrirlash: ${tpl.title}`;

  inputTitle.value = tpl.title;
  inputCategory.value = tpl.category;
  inputDuration.value = tpl.duration;
  inputMediaCount.value = tpl.clips;
  inputVideoUrl.value = tpl.videoUrl;
  inputPosterUrl.value = tpl.posterUrl || '';
  inputCapcutUrl.value = tpl.capcutUrl;
  if (inputMusic) inputMusic.value = tpl.music || '';

  templateForm.scrollIntoView({ behavior: 'smooth' });
};

window.deleteTemplate = function(id) {
  if (confirm("Haqiqatan ham bu shablonni o'chirmoqchimisiz?")) {
    templates = templates.filter(t => t.id !== id);
    saveAndRefresh();
  }
};

if (resetFormBtn) {
  resetFormBtn.addEventListener('click', () => {
    editingId = null;
    formTitle.textContent = "Yangi shablon qo'shish";
    templateForm.reset();
  });
}

function saveAndRefresh() {
  localStorage.setItem('capcut_custom_templates', JSON.stringify(templates));
  renderAdminList();
}

if (exportJsonBtn) {
  exportJsonBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "templates.json");
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  });
}

if (resetDefaultsBtn) {
  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm("Barcha o'zgarishlar o'chib, asl holatiga qaytarilsinmi?")) {
      localStorage.removeItem('capcut_custom_templates');
      loadAdminTemplates();
    }
  });
}

document.addEventListener('DOMContentLoaded', checkAuth);
