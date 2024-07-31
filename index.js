// indexeddb.js

// Função para abrir o banco de dados IndexedDB
function openDatabase() {
    const request = indexedDB.open('gestao_barril', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('barrels')) {
            db.createObjectStore('barrels', { keyPath: 'id' });
        }
    };

    return new Promise((resolve, reject) => {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Função para adicionar um barril
async function addBarrel(barrel) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readwrite');
    const store = transaction.objectStore('barrels');
    store.put(barrel);
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

// Função para obter todos os barris
async function getAllBarrels() {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readonly');
    const store = transaction.objectStore('barrels');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Função para consumir água de um barril
async function consumeFromBarrel(barrelId, amount) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readwrite');
    const store = transaction.objectStore('barrels');
    const barrel = await store.get(barrelId);
    if (barrel) {
        barrel.capacity -= amount;
        store.put(barrel);
    }
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

// index.js

document.addEventListener('DOMContentLoaded', async () => {
    const barrelList = document.getElementById('barrelList');
    const addBarrelButton = document.getElementById('addBarrelButton');
    const registerBarrelButton = document.getElementById('registerBarrel');
    const barrelModal = document.getElementById('barrelModal');
    const closeBarrelModal = document.querySelector('.close-barrel');
    const consumeModal = document.getElementById('consumeModal');
    const closeConsumeModal = document.querySelector('.close-consume-modal');
    const confirmButton = document.getElementById('confirmButton');
    const confirmButtonGarrafa = document.getElementById('confirmButtonGarrafa');
    const quantityInput = document.getElementById('quantity');
    const quantityGarrafaInput = document.getElementById('quantityGarrafa');
    const decrementButton = document.getElementById('decrement');
    const incrementButton = document.getElementById('increment');
    const decrementGarrafaButton = document.getElementById('decrementGarrafa');
    const incrementGarrafaButton = document.getElementById('incrementGarrafa');
    let selectedBarrelId = null; // Armazena o ID do barril selecionado
     const copoImg = document.getElementById('copoImg');
     const garrafaImg = document.getElementById('garrafaImg');
     const copoImgc = document.getElementById('copoImageC');
     const garrafaImgG = document.getElementById('garrafaImgG');
     garrafaImg.addEventListener('click', function() {
        alert('Seleccione um barril para consumires água!')
       
    });
    copoImg.addEventListener('click', function() {
        alert('Seleccione um barril para consumires água!')
       
    });
    
    // Fechar modal ao clicar no botão de fechar da garrafa
    garrafaSpan.addEventListener('click', function() {
        garrafaModal.style.display = 'none';
        copoModal.style.display = 'none';
    });

    // Função para atualizar a lista de barris
    async function updateBarrelList() {
        barrelList.innerHTML = ''; // Limpa a lista antes de atualizar
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
                    consumeButton.onclick = () => {
                        document.getElementById('consumeModal').style.display = 'block';
                        document.getElementById('consumeModal').setAttribute('data-barrel-id', barrel.id);
                        updateConsumeChart(barrel.id, barrel.capacity);
                    };
                    li.appendChild(consumeButton);
                    barrelList.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar a lista de barris:', error);
        }
    }

    // Função para mostrar o modal de cadastro
    addBarrelButton.onclick = () => {
        barrelModal.style.display = 'block';
    };

    // Fechar o modal de cadastro
    closeBarrelModal.onclick = () => {
        barrelModal.style.display = 'none';
    };

    // Registrar novo barril
    registerBarrelButton.onclick = async () => {
        const barrelId = parseInt(document.getElementById('barrelId').value, 10);
        const barrelCapacity = parseFloat(document.getElementById('barrelCapacity').value);
        if (isNaN(barrelId) || isNaN(barrelCapacity) || barrelId <= 0 || barrelCapacity <= 0) {
            alert('Por favor, insira um ID e uma capacidade válidos.');
            return;
        }
        try {
            await addBarrel({ id: barrelId, capacity: barrelCapacity });
            barrelModal.style.display = 'none';
            await updateBarrelList(); // Atualiza a lista de barris
        } catch (error) {
            console.error('Erro ao registrar barril:', error);
        }
    };

    // Fechar o modal de consumo
    closeConsumeModal.onclick = () => {
        consumeModal.style.display = 'none';
    };

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

    // Função para atualizar o gráfico de consumo
    function updateConsumeChart(barrelId, capacity) {
        myChart.data.labels = [`Barril ${barrelId}`];
        myChart.data.datasets[0].data = [capacity];
        myChart.update();
    }

    // Eventos dos botões de incremento e decremento
    decrementButton.onclick = () => {
        let value = parseFloat(quantityInput.value);
        if (value > 0) quantityInput.value = (value - 0.25).toFixed(2);
    };
    incrementButton.onclick = () => {
        let value = parseFloat(quantityInput.value);
        quantityInput.value = (value + 0.25).toFixed(2);
    };
    decrementGarrafaButton.onclick = () => {
        let value = parseFloat(quantityGarrafaInput.value);
        if (value > 0) quantityGarrafaInput.value = (value - 1).toFixed(2);
    };
    incrementGarrafaButton.onclick = () => {
        let value = parseFloat(quantityGarrafaInput.value);
        quantityGarrafaInput.value = (value + 1).toFixed(2);
    };

    // Confirmar consumo
    confirmButton.onclick = async () => {
        const quantity = parseFloat(quantityInput.value);
        const barrelId = parseInt(document.getElementById('consumeModal').getAttribute('data-barrel-id'), 10);
        if (isNaN(barrelId) || isNaN(quantity) || quantity <= 0) {
            alert('Por favor, insira um ID de barril e uma quantidade válidos.');
            return;
        }
        try {
            await consumeFromBarrel(barrelId, quantity);
            await updateBarrelList(); // Atualiza a lista de barris
            consumeModal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao consumir do barril:', error);
        }
    };

    confirmButtonGarrafa.onclick = async () => {
        const quantity = parseFloat(quantityGarrafaInput.value);
        const barrelId = parseInt(document.getElementById('consumeModal').getAttribute('data-barrel-id'), 10);
        if (isNaN(barrelId) || isNaN(quantity) || quantity <= 0) {
            alert('Por favor, insira um ID de barril e uma quantidade válidos.');
            return;
        }
        try {
            await consumeFromBarrel(barrelId, quantity);
            await updateBarrelList(); // Atualiza a lista de barris
            consumeModal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao consumir do barril:', error);
        }
    };

    // Atualizar lista de barris ao carregar
    await updateBarrelList();
});
confirmButton.onclick = async () => {
    if (selectedBarrelId === null) {
        alert('Por favor, selecione um barril para consumo.');
        return;
    }
    const quantity = parseFloat(quantityInput.value);
    if (isNaN(quantity) || quantity <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    try {
        await consumeFromBarrel(selectedBarrelId, quantity);
        await updateBarrelList(); // Atualiza a lista de barris
        consumeModal.style.display = 'none';
        selectedBarrelId = null; // Resetando o ID do barril selecionado
    } catch (error) {
        console.error('Erro ao consumir do barril:', error);
    }
};

