// main.js

document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Inicializar o gráfico
    initChart(ctx);

    // Atualizar o gráfico com o volume inicial do IndexedDB
    getVolume().then(volume => {
        updateChart(volume);
    });

    // Seletores e eventos dos modais
    const copoModal = document.getElementById('myModal');
    const copoImg = document.getElementById('copoImg');
    const closeBtn = document.querySelector('.close');
    const confirmButtonCopo = document.getElementById('confirmButton');
    const quantityInputCopo = document.getElementById('quantity');
    const decrementButtonCopo = document.getElementById('decrement');
    const incrementButtonCopo = document.getElementById('increment');

    const garrafaModal = document.getElementById('garrafaModal');
    const garrafaImg = document.getElementById('garrafaImg');
    const garrafaSpan = document.querySelector('.close-garrafa');
    const confirmButtonGarrafa = document.getElementById('confirmButtonGarrafa');
    const quantityInputGarrafa = document.getElementById('quantityGarrafa');
    const decrementButtonGarrafa = document.getElementById('decrementGarrafa');
    const incrementButtonGarrafa = document.getElementById('incrementGarrafa');

    // Abrir modal ao clicar na imagem do copo
    copoImg.addEventListener('click', function() {
        copoModal.style.display = 'block';
        garrafaModal.style.display = 'none';
    });

    // Fechar modal ao clicar no botão de fechar do copo
    closeBtn.addEventListener('click', function() {
        copoModal.style.display = 'none';
    });

    // Fechar modal se clicar fora da área do modal do copo
    window.addEventListener('click', function(event) {
        if (event.target === copoModal) {
            copoModal.style.display = 'none';
        }
    });

    // Decrementar quantidade de copos
    decrementButtonCopo.addEventListener('click', function() {
        quantityInputCopo.value = Math.max(parseInt(quantityInputCopo.value) - 1, 0);
    });

    // Incrementar quantidade de copos
    incrementButtonCopo.addEventListener('click', function() {
        quantityInputCopo.value = parseInt(quantityInputCopo.value) + 1;
    });

    // Atualizar gráfico ao confirmar a quantidade consumida do copo
    confirmButtonCopo.addEventListener('click', async function() {
        const quantity = parseInt(quantityInputCopo.value);
        const waterConsumed = quantity * 0.25;

        if (!isNaN(quantity) && quantity >= 0) {
            const currentVolume = await getVolume();
            const newVolume = Math.max(currentVolume - waterConsumed, 0);

            await updateVolume(newVolume);
            updateChart(newVolume);

            copoModal.style.display = 'none';
        } else {
            alert('Por favor, insira uma quantidade válida de copos.');
        }
    });

    // Abrir modal ao clicar na imagem da garrafa
    garrafaImg.addEventListener('click', function() {
        garrafaModal.style.display = 'block';
        copoModal.style.display = 'block';
    });

    // Fechar modal ao clicar no botão de fechar da garrafa
    garrafaSpan.addEventListener('click', function() {
        garrafaModal.style.display = 'none';
        copoModal.style.display = 'none';
    });

    // Fechar modal se clicar fora da área do modal da garrafa
    window.addEventListener('click', function(event) {
        if (event.target === garrafaModal) {
            garrafaModal.style.display = 'none';
            copoModal.style.display = 'none';
        }
    });

    // Decrementar quantidade de garrafas
    decrementButtonGarrafa.addEventListener('click', function() {
        quantityInputGarrafa.value = Math.max(parseInt(quantityInputGarrafa.value) - 1, 0);
    });

    // Incrementar quantidade de garrafas
    incrementButtonGarrafa.addEventListener('click', function() {
        quantityInputGarrafa.value = parseInt(quantityInputGarrafa.value) + 1;
    });

    // Atualizar gráfico ao confirmar a quantidade consumida da garrafa
    confirmButtonGarrafa.addEventListener('click', async function() {
        const quantity = parseInt(quantityInputGarrafa.value);
        const waterConsumed = quantity ;

        if (!isNaN(quantity) && quantity >= 0) {
            const currentVolume = await getVolume();
            const newVolume = Math.max(currentVolume - waterConsumed, 0);

            await updateVolume(newVolume);
            updateChart(newVolume);

            garrafaModal.style.display = 'none';
        } else {
            alert('Por favor, insira uma quantidade válida de garrafas.');
        }
    });
});
