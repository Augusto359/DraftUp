const areaUpload = document.getElementById('area-upload');
const previewImagem = document.getElementById('preview-imagem');

// Previne o comportamento padrão do navegador
areaUpload.addEventListener('dragover', (e) => e.preventDefault());

areaUpload.addEventListener('drop', (e) => {
    e.preventDefault();

    // 1. Pega o primeiro arquivo solto
    const arquivo = e.dataTransfer.files[0];

    // 2. Verifica se o usuário realmente soltou uma imagem
    if (arquivo && arquivo.type.startsWith('image/')) {
        // 3. Cria o leitor de arquivos
        const leitor = new FileReader();

        // 4. Quando o leitor terminar de processar a imagem...
        leitor.onload = function (eventoResultado) {
            // Define o "src" da imagem com o resultado do leitor
            previewImagem.src = eventoResultado.target.result;
            // Faz a tag <img> aparecer na tela
            previewImagem.style.display = 'block';
        };

        // 5. Manda o leitor processar o arquivo como uma URL de dados
        leitor.readAsDataURL(arquivo);
    } else {
        alert('Por favor, envie apenas arquivos de imagem!');
    }
});
