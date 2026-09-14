const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfArkU7sRQorkxKbgFoqx6lEJYtb3drH4CvcjT6N9PuOTKq1A/formResponse";

const form = document.getElementById('meuForm');
const btn = document.getElementById('btnEnviar');

// Elementos do Modal
const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalBtnClose = document.getElementById('modalBtnClose');

function showModal(type, title, message) {
    modalIcon.className = `modal-icon ${type}`;
    modalIcon.textContent = type === 'success' ? '✓' : '✕';
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalBtnClose.focus();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
}

// Fechar modal ao clicar no botão, clicar fora ou pressionar Escape
modalBtnClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btn.disabled = true;
    btn.innerText = "Enviando...";

    // 1. Converte os dados para o formato URL Encoded que o Forms exige
    const formData = new FormData(form);
    const urlParams = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        urlParams.append(key, value);
    }

    // 2. Flags internas obrigatórias do Google Forms para aceitar envio direto de todas as seções
    urlParams.append("fvv", "1");
    urlParams.append("pageHistory", "0,1"); // Pula a validação de etapas entre a seção 1 e 2

    try {
        await fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlParams.toString()
        });

        showModal('success', 'Cadastro realizado!', 'Sua conta foi cadastrada com sucesso.');
        form.reset();
    } catch (err) {
        console.error("Erro no envio:", err);
        showModal('error', 'Falha no cadastro', 'Ocorreu um erro ao enviar seus dados. Tente novamente mais tarde.');
    } finally {
        btn.disabled = false;
        btn.innerText = "Cadastrar";
    }
});
