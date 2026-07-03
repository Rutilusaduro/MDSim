let pendingConfirm = null;

export function openConfirmModal(message, onYes, openModal) {
  pendingConfirm = onYes;
  openModal(`
    <h2 class="text-2xl font-black text-stone-50">Confirm</h2>
    <p class="mt-4 text-sm leading-7 text-stone-200">${message}</p>
    <div class="mt-6 flex flex-wrap gap-3">
      <button class="gold-button rounded-2xl px-5 py-3 font-bold" data-action="confirm-yes">Yes</button>
      <button class="dark-button rounded-2xl px-5 py-3 font-bold" data-action="confirm-no">Cancel</button>
    </div>
  `);
}

export function handleConfirmYes() {
  const cb = pendingConfirm;
  pendingConfirm = null;
  if (cb) cb();
}

export function handleConfirmNo() {
  pendingConfirm = null;
}

export function hasPendingConfirm() {
  return Boolean(pendingConfirm);
}
