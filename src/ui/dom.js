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

/** A desk slip, not a toast: a paper note set down at the bottom of
 * the desk and taken away again. Errors are written in accent ink. */
export function showToast(message, type = 'success') {
  const existing = document.querySelector('#toast');
  if (existing) existing.remove();
  const slip = document.createElement('div');
  slip.id = 'toast';
  slip.className = `desk-slip${type === 'error' ? ' desk-slip-error' : ''}`;
  slip.textContent = message;
  document.body.appendChild(slip);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => slip.remove(), 3200);
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
