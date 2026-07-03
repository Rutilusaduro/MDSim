let queue = [];
let showing = false;

export function queueModal(html, { onClose } = {}) {
  queue.push({ html, onClose });
  if (!showing) showNextModal();
}

export function showNextModal(openModal, closeModal) {
  if (!queue.length) {
    showing = false;
    return;
  }
  showing = true;
  const { html, onClose } = queue.shift();
  openModal(
    `${html}
    <div class="mt-6 flex justify-end">
      <button class="gold-button rounded-2xl px-5 py-3 font-bold" data-action="advance-modal-queue">Continue</button>
    </div>`,
    onClose,
  );
}

export function clearModalQueue() {
  queue = [];
  showing = false;
}

export function modalQueueLength() {
  return queue.length;
}
