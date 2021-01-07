const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.querySelector("#overlay")

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    });
});

function openModal(modalTarget) {
    if (modalTarget == null) return
    modalTarget.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modalTarget) {
    if (modalTarget == null) return
    modalTarget.classList.remove('active')
    overlay.classList.remove('active')
}
