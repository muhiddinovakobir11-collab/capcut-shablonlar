/**
 * CapCut Shablonlar Boshqaruv Paneli (Admin)
 * Muallif: Akobir
 */

// Boshlang'ich shartli parol (xohlagancha o'zgartirishingiz mumkin)
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
const inputDescription = document.getElementById('input-description');
const inputDuration = document.getElementById('input-duration');
const inputMediaCount = document.getElementById('input-media-count');
const inputTag = document.getElementById('input-tag');
const inputVideoUrl = document.getElementById('input-video-url');
const inputPosterUrl = document.getElementById('input-poster-url');
const inputCapcutUrl = document.getElementById('input-capcut-url');

// Tizimga kirish tekshiruvi
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

// Kirish tugmasi
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const entered = adminPassInput.value.trim();
    if (entered === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      loginError.classList.add('hidden');
      checkAuth();
    } else {
      loginError.classList.remove('hidden');
    }
  });
}

// Enter bosilganda kirish
if (adminPassInput) {
  adminPassInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });
}

// Chiqish
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    checkAuth();
  });
}

// Shablonlarni yuklash
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

// Ro'yxatni chizish
function renderAdminList() {
  if (!templatesTableBody) return;

  if (templates.length === 0) {
    templatesTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-8 text-center text-slate-400">
          Hozircha hech qanday shablon mavjud emas. Quyidagi forma orqali yangi shablon qo'shing.
        </td>
      </tr>
    `;
    return;
  }

  templatesTableBody.innerHTML = templates.map((tpl, index) => {
    return `
      <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition">
        <td class="px-4 py-4 text-sm text-slate-400">${index + 1}</td>
        <td class="px-4 py-4">
          <div class="flex items-center gap-3">
            <img src="${tpl.posterUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'}" alt="${tpl.title}" class="w-12 h-16 object-cover rounded-lg border border-slate-700">
            <div>
              <p class="font-bold text-white text-sm">${tpl.title}</p>
              <p class="text-xs text-slate-400 line-clamp-1">${tpl.description}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-4">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-900/40 border border-purple-500/30 text-purple-300">
            ${tpl.category}
          </span>
        </td>
        <td class="px-4 py-4 text-xs text-slate-300">
          <p>⏳ ${tpl.duration || '0:15'}</p>
          <p>📷 ${tpl.mediaCount || '5 ta media'}</p>
        </td>
        <td class="px-4 py-4 text-xs font-mono">
          <a href="${tpl.capcutUrl}" target="_blank" class="text-pink-400 hover:underline flex items-center gap-1 max-w-[180px] truncate">
            <span>Havolani ochish</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </td>
        <td class="px-4 py-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="editTemplate('${tpl.id}')" class="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-medium border border-blue-500/30 transition">
              Tahrirlash
            </button>
            <button onclick="deleteTemplate('${tpl.id}')" class="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 text-xs font-medium border border-red-500/30 transition">
              O'chirish
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Formani yuborish (Yangi qo'shish yoki tahrirlash)
if (templateForm) {
  templateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTemplate = {
      id: editingId || `template-${Date.now()}`,
      title: inputTitle.value.trim(),
      category: inputCategory.value,
      description: inputDescription.value.trim(),
      duration: inputDuration.value.trim() || "0:15",
      mediaCount: inputMediaCount.value.trim() || "5 ta rasm / video",
      views: "1.2K",
      tag: inputTag.value.trim(),
      videoUrl: inputVideoUrl.value.trim(),
      posterUrl: inputPosterUrl.value.trim(),
      capcutUrl: inputCapcutUrl.value.trim()
    };

    if (editingId) {
      // Tahrirlash
      const index = templates.findIndex(t => t.id === editingId);
      if (index !== -1) {
        templates[index] = { ...templates[index], ...newTemplate };
      }
      editingId = null;
      formTitle.textContent = "Yangi shablon qo'shish";
    } else {
      // Yangi qo'shish
      templates.unshift(newTemplate);
    }

    saveAndRefresh();
    templateForm.reset();
    alert("Shablon muvaffaqiyatli saqlandi!");
  });
}

// Tahrirlash rejimiga o'tish
window.editTemplate = function(id) {
  const tpl = templates.find(t => t.id === id);
  if (!tpl) return;

  editingId = id;
  formTitle.textContent = `Tahrirlash: ${tpl.title}`;

  inputTitle.value = tpl.title;
  inputCategory.value = tpl.category;
  inputDescription.value = tpl.description;
  inputDuration.value = tpl.duration;
  inputMediaCount.value = tpl.mediaCount;
  inputTag.value = tpl.tag || '';
  inputVideoUrl.value = tpl.videoUrl;
  inputPosterUrl.value = tpl.posterUrl || '';
  inputCapcutUrl.value = tpl.capcutUrl;

  templateForm.scrollIntoView({ behavior: 'smooth' });
};

// Shablonni o'chirish
window.deleteTemplate = function(id) {
  if (confirm("Haqiqatan ham bu shablonni o'chirmoqchimisiz?")) {
    templates = templates.filter(t => t.id !== id);
    saveAndRefresh();
  }
};

// Formani bekor qilish
if (resetFormBtn) {
  resetFormBtn.addEventListener('click', () => {
    editingId = null;
    formTitle.textContent = "Yangi shablon qo'shish";
    templateForm.reset();
  });
}

// Saqlash va yangilash
function saveAndRefresh() {
  localStorage.setItem('capcut_custom_templates', JSON.stringify(templates));
  renderAdminList();
}

// JSON fayl sifatida yuklab olish (Vercel yoki serverga qo'yish uchun juda qulay)
if (exportJsonBtn) {
  exportJsonBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "templates.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });
}

// Boshlang'ich holatga qaytarish
if (resetDefaultsBtn) {
  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm("Barcha o'zgarishlar o'chib, boshlang'ich 6 ta shablon qaytarilsinmi?")) {
      localStorage.removeItem('capcut_custom_templates');
      loadAdminTemplates();
    }
  });
}

// Yuklash
document.addEventListener('DOMContentLoaded', checkAuth);
