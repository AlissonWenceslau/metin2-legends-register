const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfArkU7sRQorkxKbgFoqx6lEJYtb3drH4CvcjT6N9PuOTKq1A/formResponse";

const form = document.getElementById('meuForm');
const btn = document.getElementById('btnEnviar');

// Campos do Formulário
const inputOrigem = document.getElementById('origem');
const inputLogin = document.getElementById('login');
const inputSenha = document.getElementById('senha');
const inputEmail = document.getElementById('email');
const inputSafebox = document.getElementById('safebox');

const formFields = [inputOrigem, inputLogin, inputSenha, inputEmail, inputSafebox];

// Elementos do Modal
const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalBtnClose = document.getElementById('modalBtnClose');

/* ================= VALIDAÇÕES ================= */
function validateField(field) {
    const value = field.value.trim();
    let errorMessage = "";

    if (field.id === 'origem') {
        if (!value) {
            errorMessage = "Selecione como você conheceu o servidor.";
        }
    } else if (field.id === 'login') {
        if (!value) {
            errorMessage = "Informe o seu login de usuário.";
        } else if (value.length < 4 || value.length > 16) {
            errorMessage = "O login deve conter entre 4 e 16 caracteres.";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            errorMessage = "Use apenas letras, números ou underline (_).";
        }
    } else if (field.id === 'senha') {
        if (!value) {
            errorMessage = "A senha de acesso é obrigatória.";
        } else if (value.length < 6) {
            errorMessage = "A senha deve conter no mínimo 6 caracteres.";
        }
    } else if (field.id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            errorMessage = "O e-mail é obrigatório.";
        } else if (!emailRegex.test(value)) {
            errorMessage = "Informe um endereço de e-mail válido.";
        }
    } else if (field.id === 'safebox') {
        if (!value) {
            errorMessage = "O código do personagem é obrigatório.";
        } else if (value.length < 4 || value.length > 7) {
            errorMessage = "O código deve conter entre 4 e 7 caracteres.";
        }
    }

    const errorEl = document.getElementById(`error-${field.id}`);

    if (errorMessage) {
        field.classList.add('is-invalid');
        if (errorEl) {
            errorEl.innerHTML = `<span class="error-icon">⚠</span><span>${errorMessage}</span>`;
            errorEl.classList.add('visible');
        }
        return false;
    } else {
        field.classList.remove('is-invalid');
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove('visible');
        }
        return true;
    }
}

function clearAllErrors() {
    formFields.forEach(field => {
        field.classList.remove('is-invalid');
        const errorEl = document.getElementById(`error-${field.id}`);
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove('visible');
        }
    });
}

// Ouvintes em tempo real para remover erros ao corrigir
formFields.forEach(field => {
    field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
            validateField(field);
        }
    });

    field.addEventListener('change', () => {
        if (field.classList.contains('is-invalid')) {
            validateField(field);
        }
    });

    field.addEventListener('blur', () => {
        if (field.value.trim() !== '') {
            validateField(field);
        }
    });
});

/* ================= MODAL DE FEEDBACK ================= */
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

/* ================= SUBMISSÃO DO FORMULÁRIO ================= */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Valida todos os campos
    let isFormValid = true;
    let firstInvalidField = null;

    formFields.forEach(field => {
        const valid = validateField(field);
        if (!valid) {
            isFormValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
    });

    if (!isFormValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        return;
    }

    btn.disabled = true;
    btn.innerText = "Enviando...";

    // 2. Converte os dados para o formato URL Encoded que o Forms exige
    const formData = new FormData(form);
    const urlParams = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        urlParams.append(key, value);
    }

    // 3. Flags internas obrigatórias do Google Forms para aceitar envio direto de todas as seções
    urlParams.append("fvv", "1");
    urlParams.append("pageHistory", "0,1");

    try {
        await fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlParams.toString()
        });

        showModal('success', 'Cadastro realizado!', 'Sua conta foi cadastrada com sucesso nas lendas do Metin2.');
        form.reset();
        clearAllErrors();
    } catch (err) {
        console.error("Erro no envio:", err);
        showModal('error', 'Falha no cadastro', 'Ocorreu um erro ao enviar seus dados. Tente novamente mais tarde.');
    } finally {
        btn.disabled = false;
        btn.innerText = "Cadastrar";
    }
});
