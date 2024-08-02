document.addEventListener('DOMContentLoaded', async () => {
    // Seção de elementos DOM
    const barrelList = document.getElementById('barrelList');
    const addBarrelButton = document.getElementById('addBarrelButton');
    const registerBarrelButton = document.getElementById('registerBarrel');
    const barrelModal = document.getElementById('barrelModal');
    const closeBarrelModal = document.querySelector('.close-barrel');
    const consumeModal = document.getElementById('consumeModal');
    const closeConsumeModal = document.querySelector('.close-consume-modal');
    const confirmButton = document.getElementById('confirmButton');
    const quantityInput = document.getElementById('quantity');
    const quantityGarrafaInput = document.getElementById('quantityGarrafa');
    const decrementButton = document.getElementById('decrement');
    const incrementButton = document.getElementById('increment');
    const decrementGarrafaButton = document.getElementById('decrementGarrafa');
    const incrementGarrafaButton = document.getElementById('incrementGarrafa');
    const copoImg = document.getElementById('copoImg');
    const garrafaImg = document.getElementById('garrafaImg');
    const copoImgC = document.getElementById('copoImageC');
    const copoModal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.close');
    const confirmButtonCopo = document.getElementById('confirmButton');
    const quantityInputCopo = document.getElementById('quantity');
    const decrementButtonCopo = document.getElementById('decrement');
    const incrementButtonCopo = document.getElementById('increment');
    const garrafaImageG = document.getElementById('garrfaImageG');
    const garrafaModal = document.getElementById('garrafaModal');
    const garrafaSpan = document.querySelector('.close-garrafa');
    const confirmButtonGarrafa = document.getElementById('confirmButtonGarrafa');
    const quantityGarrafa = document.getElementById('quantityGarrafa');
    const decrementGarrafa = document.getElementById('decrementGarrafa');
    const incrementGarrafa = document.getElementById('incrementGarrafa');
    let selectedBarrelId = null;
// Array global para armazenar barris
const barrels = [];

    // Inicializar o gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Capacidade dos Barris',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Funções auxiliares
    function generateRandomId() {
        return Math.floor(Math.random() * 10000) + 1;
    }

    function updateQuantity(id, increment) {
        const input = document.getElementById(id);
        let value = parseFloat(input.value);
        input.value = increment ? (value + 1).toFixed(2) : Math.max(0, (value - 1).toFixed(2));
    }

    function updateConsumeChart(barrelId, capacity) {
        myChart.data.labels = [`Barril ${barrelId}`];
        myChart.data.datasets[0].data = [capacity];
        myChart.update();
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Eventos dos modais
    garrafaImg.addEventListener('click', () => alert('Seleccione um barril para consumires água!'));
    copoImg.addEventListener('click', () => alert('Seleccione um barril para consumires água!'));

    garrafaImageG.addEventListener('click', () => {
        openModal('garrafaModal');
        closeModal('myModal');
    });

    garrafaSpan.addEventListener('click', () => {
        closeModal('garrafaModal');
        closeModal('myModal');
    });

    window.addEventListener('click', (event) => {
        if (event.target === copoModal) closeModal('myModal');
        if (event.target === garrafaModal) closeModal('garrafaModal');
    });

    copoImgC.addEventListener('click', () => {
        openModal('myModal');
        closeModal('garrafaModal');
    });

    closeBtn.addEventListener('click', () => closeModal('myModal'));

    // Eventos dos botões de quantidade
    decrementButton.addEventListener('click', () => updateQuantity('quantity', false));
    incrementButton.addEventListener('click', () => updateQuantity('quantity', true));

    decrementGarrafaButton.addEventListener('click', () => updateQuantity('quantityGarrafa', false));
    incrementGarrafaButton.addEventListener('click', () => updateQuantity('quantityGarrafa', true));

    decrementButtonCopo.addEventListener('click', () => updateQuantity('quantity', false));
    incrementButtonCopo.addEventListener('click', () => updateQuantity('quantity', true));

    // Confirmar consumo com copo
    confirmButtonCopo.addEventListener('click', async () => {
        const quantity = parseFloat(quantityInputCopo.value);
        if (!isNaN(quantity) && quantity >= 0) {
            const currentVolume = await getVolume();
            const newVolume = Math.max(currentVolume - quantity, 0);
            await updateVolume(newVolume);
            updateChart(newVolume);
            closeModal('myModal');
        } else {
            alert('Por favor, insira uma quantidade válida de copos.');
        }
    });

    // Confirmar consumo com garrafa
    confirmButtonGarrafa.addEventListener('click', async () => {
        const quantity = parseFloat(quantityGarrafa.value);
        if (!isNaN(quantity) && quantity >= 0) {
            const currentVolume = await getVolume();
            const newVolume = Math.max(currentVolume - quantity, 0);
            await updateVolume(newVolume);
            updateChart(newVolume);
            closeModal('garrafaModal');
        } else {
            alert('Por favor, insira uma quantidade válida de garrafas.');
        }
    });

    // Abrir modal de cadastro
    addBarrelButton.addEventListener('click', () => {
        openModal('barrelModal');
        document.getElementById('barrelId').value = generateRandomId();
    });

    // Fechar modal de cadastro
    closeBarrelModal.addEventListener('click', () => closeModal('barrelModal'));

    // Registrar novo barril
    registerBarrelButton.addEventListener('click', async () => {
        try {
            const barrelId = parseInt(document.getElementById('barrelId').value, 10);
            const barrelCapacity = parseFloat(document.getElementById('barrelCapacity').value);
            if (isNaN(barrelId) || isNaN(barrelCapacity) || barrelCapacity <= 0) {
                alert('Por favor, insira um ID e uma capacidade válidos.');
                return;
            }
            await addBarrel({ id: barrelId, capacity: barrelCapacity });
            closeModal('barrelModal');
            await updateBarrelList();
        } catch (error) {
            console.error('Erro ao registrar barril:', error);
        }
    });

    // Atualizar lista de barris
    async function updateBarrelList() {
        barrelList.innerHTML = '';
        try {
            const barrels = await getAllBarrels();
            if (barrels.length === 0) {
                barrelList.innerHTML = '<li>Nenhum barril cadastrado.</li>';
            } else {
                barrels.forEach(barrel => {
                    const li = document.createElement('li');
                    li.textContent = `Barril ${barrel.id} - Capacidade: ${barrel.capacity} L `;
                    const consumeButton = document.createElement('button');
                    consumeButton.textContent = 'Consumir';
                    consumeButton.addEventListener('click', () => {
                        openModal('consumeModal');
                        document.getElementById('consumeModal').setAttribute('data-barrel-id', barrel.id);
                        updateConsumeChart(barrel.id, barrel.capacity);
                    });
                    li.appendChild(consumeButton);
                    barrelList.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar a lista de barris:', error);
        }
    }

    // Fechar modal de consumo
    closeConsumeModal.addEventListener('click', () => closeModal('consumeModal'));

    // Confirmar consumo com modal de consumo
    confirmButton.addEventListener('click', async () => {
        if (selectedBarrelId === null) {
            alert('Por favor, selecione um barril para consumo.');
            return;
        }
        const quantity = parseFloat(quantityInput.value);
        if (!isNaN(quantity) && quantity > 0) {
            try {
                await consumeFromBarrel(selectedBarrelId, quantity);
                await updateBarrelList();
                closeModal('consumeModal');
                selectedBarrelId = null;
            } catch (error) {
                console.error('Erro ao consumir do barril:', error);
            }
        } else {
            alert('Por favor, insira uma quantidade válida.');
        }
    });

    // Atualizar lista de barris ao carregar
    await updateBarrelList();
});

// Funções de mock
async function getAllBarrels() {
    return [
        { id: 1, capacity: 100 },
        { id: 2, capacity: 150 }
    ];
}

async function addBarrel(barrel) {
    // Implementar a lógica de adição
}

async function consumeFromBarrel(barrelId, quantity) {
    // Implementar a lógica de consumo
}

async function updateVolume(newVolume) {
    // Implementar a lógica de atualização de volume
}

async function getVolume() {
    return 1000;
}
// Array para armazenar barris
const barrels = [];

// Função para adicionar um barril
function addBarrel(barrel) {
    barrels.push(barrel);
}

// Função para atualizar a lista de barris na UI
function updateBarrelList() {
    barrelList.innerHTML = '';
    if (barrels.length === 0) {
        barrelList.innerHTML = '<li>Nenhum barril cadastrado.</li>';
    } else {
        barrels.forEach(barrel => {
            const li = document.createElement('li');
            li.textContent = `Barril ${barrel.id} - Capacidade: ${barrel.capacity} L `;
            const consumeButton = document.createElement('button');
            consumeButton.textContent = 'Consumir';
            consumeButton.addEventListener('click', () => {
                selectedBarrelId = barrel.id;
                openModal('consumeModal');
            });
            li.appendChild(consumeButton);
            barrelList.appendChild(li);
        });
    }
}
confirmButton.addEventListener('click', async () => {
    if (selectedBarrelId === null) {
        alert('Por favor, selecione um barril para consumo.');
        return;
    }
    const quantity = parseFloat(quantityInput.value);
    if (!isNaN(quantity) && quantity > 0) {
        // Encontra o barril e atualiza sua capacidade
        const barrel = barrels.find(b => b.id === selectedBarrelId);
        if (barrel) {
            barrel.capacity = Math.max(barrel.capacity - quantity, 0);
        }
        // Atualiza a lista de barris
        updateBarrelList();
        closeModal('consumeModal');
        selectedBarrelId = null;
    } else {
        alert('Por favor, insira uma quantidade válida.');
    }
});
