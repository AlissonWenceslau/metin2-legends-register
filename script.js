const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfArkU7sRQorkxKbgFoqx6lEJYtb3drH4CvcjT6N9PuOTKq1A/formResponse";

const form = document.getElementById('meuForm');
const btn = document.getElementById('btnEnviar');

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

        alert("✅ Enviado com sucesso!");
        form.reset();
    } catch (err) {
        console.error("Erro no envio:", err);
        alert("❌ Falha no envio.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Cadastrar";
    }
});
