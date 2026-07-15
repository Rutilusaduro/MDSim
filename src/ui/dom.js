let toastTimer = null;

export const app = () => document.querySelector('#app');
export const modalRoot = () => document.querySelector('#modal-root');

export function e(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function showToast(message, type = 'success') {
  const existing = document.querySelector('#toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 text-sm shadow-2xl ${
    type === 'error'
      ? 'border-red-300/30 bg-red-950/90 text-red-100'
      : 'border-amber-200/25 bg-stone-950/92 text-amber-50'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 3200);
}

export function openModal(content) {
  modalRoot().innerHTML = `
    <div class="modal-backdrop fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" data-action="close-modal">
      <div class="modal-card glass-panel max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[2rem] p-6 md:p-8" data-modal-card>
        ${content}
      </div>
    </div>
  `;
}

export function closeModal() {
  modalRoot().innerHTML = '';
}
