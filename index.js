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

    // Função para atualizar a lista de barris
    async function updateBarrelList() {
        barrelList.innerHTML = '';
        const barrels = await getAllBarrels();
        barrels.forEach(barrel => {
            const li = document.createElement('li');
            li.textContent = `Barril ${barrel.id} - Capacidade: ${barrel.capacity} L `;
            const consumeButton = document.createElement('button');
            consumeButton.textContent = 'Consumir';
            consumeButton.onclick = () => {
                document.getElementById('consumeModal').style.display = 'block';
                // Atualiza o gráfico para refletir o consumo
                updateConsumeChart(barrel.id, barrel.capacity);
            };
            li.appendChild(consumeButton);
            barrelList.appendChild(li);
        });
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
        const barrelId = parseInt(document.getElementById('barrelId').value);
        const barrelCapacity = parseFloat(document.getElementById('barrelCapacity').value);
        await addBarrel({ id: barrelId, capacity: barrelCapacity });
        barrelModal.style.display = 'none';
        updateBarrelList();
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
        // Atualize o gráfico com base no consumo
        // ... (implementação do gráfico de consumo)
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
        await consumeFromBarrel(1, quantity); // Ajuste conforme o ID do barril
        updateBarrelList();
        consumeModal.style.display = 'none';
    };

    confirmButtonGarrafa.onclick = async () => {
        const quantity = parseFloat(quantityGarrafaInput.value);
        await consumeFromBarrel(1, quantity); // Ajuste conforme o ID do barril
        updateBarrelList();
        consumeModal.style.display = 'none';
    };

    // Atualizar lista de barris ao carregar
    updateBarrelList();
});
