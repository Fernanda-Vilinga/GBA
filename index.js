// Função para abrir e configurar o banco de dados IndexedDB
let db = null;

async function openDatabase() {
    if (db) return db;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open('gestao_barril', 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('barrels')) {
                const objectStore = db.createObjectStore('barrels', { keyPath: 'id' });
                objectStore.createIndex('capacity', 'capacity', { unique: false });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function(event) {
            console.error('Erro ao abrir o IndexedDB', event);
            reject(event.target.error);
        };
    });
}

// Função para obter todos os barris do IndexedDB

async function getBarrelById(barrelId) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readonly');
    const store = transaction.objectStore('barrels');
    const request = store.get(barrelId);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}



// Inicializa o banco de dados (opcional, dependendo de quando você deseja abrir o banco de dados)
openDatabase().catch(error => console.error('Erro ao inicializar o banco de dados:', error));

// Espera o DOM estar carregado antes de adicionar eventos
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
    const decrementButton = document.getElementById('decrement');
    const incrementButton = document.getElementById('increment');
    const decrementGarrafaButton = document.getElementById('decrementGarrafa');
    const incrementGarrafaButton = document.getElementById('incrementGarrafa');
    const copoImg = document.getElementById('copoImg');
    const garrafaImg = document.getElementById('garrafaImg');
    const copoImgC = document.getElementById('copoImageC');
    const copoModal = document.getElementById('myModal');
    const closeBtn = document.querySelector('.close');
    const garrafaImageG = document.getElementById('garrfaImageG');
    const garrafaModal = document.getElementById('garrafaModal');
    const garrafaSpan = document.querySelector('.close-garrafa');
    const confirmButtonGarrafa = document.getElementById('confirmButtonGarrafa');
    const quantityGarrafa = document.getElementById('quantityGarrafa');
    
    let selectedBarrelId = null;
    // Função para adicionar ou atualizar um barril
async function addOrUpdateBarrel(barrel) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readwrite');
    const store = transaction.objectStore('barrels');
    store.put(barrel); // Usa put para adicionar ou atualizar o barril

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}
//Mostrar a lista e botao consumir 
async function updateBarrelList() {
    try {
        const barrels = await getAllBarrels();
        if (!barrelList) {
            console.error('Elemento barrelList não encontrado.');
            return;
        }
        barrelList.innerHTML = '';
        if (barrels.length === 0) {
            barrelList.innerHTML = '<li>Nenhum barril cadastrado.</li>';
        } else {
            barrels.forEach(barrel => {
                const li = document.createElement('li');
                li.textContent = `Barril ${barrel.id} - Capacidade: ${barrel.capacity} L `;

                const consumeButton = document.createElement('button');
                consumeButton.textContent = 'Consumir';

                
                // Evento do botão "Consumir"
// Evento do botão "Consumir"
consumeButton.addEventListener('click', async () => {
    selectedBarrelId = barrel.id; // Define o barril selecionado
    console.log(`Barril selecionado: ${selectedBarrelId}`);
    
    // Obtenha a capacidade do barril selecionado
    try {
        const barrel = await getBarrelById(selectedBarrelId);
        if (barrel) {
            updateConsumeChart(barrel.id, barrel.capacity); // Atualize o gráfico imediatamente
            openModal('consumeModal'); // Abre o modal de consumo
        } else {
            console.error('Barril não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao obter o barril:', error);
    }
});



                li.appendChild(consumeButton);
                barrelList.appendChild(li);
            });

            if (barrels.length > 0) {
                const lastBarrel = barrels[barrels.length - 1];
                updateConsumeChart(lastBarrel.id, lastBarrel.capacity);
            }
        }
    } catch (error) {
        console.error('Error updating barrel list:', error);
    }
}



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
        if (!myChart) {
            console.error('Gráfico não definido.');
            return;
        }
        console.log(`Atualizando gráfico com ID do Barril: ${barrelId}, Capacidade: ${capacity}`);
        myChart.data.labels = [`Barril ${barrelId}`];
        myChart.data.datasets[0].data = [capacity];
        myChart.update();
    }
    

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error(`Modal com ID "${modalId}" não encontrado.`);
        }
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

    // Abrir modal de cadastro
    addBarrelButton.addEventListener('click', () => {
        openModal('barrelModal');
        document.getElementById('barrelId').value = generateRandomId();
    });

    // Confirmar cadastro de barril
    registerBarrelButton.addEventListener('click', async () => {
        const barrelId = document.getElementById('barrelId').value;
        const capacity = parseFloat(document.getElementById('barrelCapacity').value);

        if (!isNaN(capacity) && capacity > 0) {
            const barrel = { id: barrelId, capacity: capacity };
            await addOrUpdateBarrel(barrel); // Use IndexedDB
            await updateBarrelList(); // Atualiza a lista de barris
            closeModal('barrelModal');
        } else {
            alert('Por favor, insira uma capacidade válida.');
        }
    });
//Confirmar consumo por copo
    confirmButton.addEventListener('click', async () => {
       
        if (selectedBarrelId === null) {
            alert('Por favor, selecione um barril para consumo.');
            return;
        }
    
        const quantity = parseFloat(quantityInput.value);
        if (!isNaN(quantity) && quantity >= 0) {
            try {
                await consumeFromBarrel(selectedBarrelId, quantity);
                await updateBarrelList(); // Atualiza a lista após o consumo
                closeModal('consumeModal');
                selectedBarrelId = null; // Limpa o ID selecionado após o consumo
            } catch (error) {
                console.error('Erro ao consumir do barril:', error);
            }
        } else {
            alert('Por favor, insira uma quantidade válida de copos.');
        }
    });
    
    // Confirmar consumo com garrafa
    confirmButtonGarrafa.addEventListener('click', async () => {
        const quantity = parseFloat(quantityGarrafa.value);
        if (!isNaN(quantity) && quantity >= 0) {
            try {
                const barrel = await getBarrelById(selectedBarrelId);
                if (barrel) {
                    const newVolume = Math.max(barrel.capacity - quantity, 0);
                    await addOrUpdateBarrel({ id: selectedBarrelId, capacity: newVolume });
                    updateConsumeChart(selectedBarrelId, newVolume);
                    closeModal('garrafaModal');
                } else {
                    console.error('Barril não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao consumir com garrafa:', error);
            }
        } else {
            alert('Por favor, insira uma quantidade válida de garrafas.');
        }
    });
    

    // Fechar modal de cadastro
    closeBarrelModal.addEventListener('click', () => closeModal('barrelModal'));

    // Fechar modal de consumo
    closeConsumeModal.addEventListener('click', () => closeModal('consumeModal'));

    // Atualizar lista de barris ao carregar
    await updateBarrelList();
});
