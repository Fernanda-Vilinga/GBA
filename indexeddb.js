// Função para abrir e configurar o banco de dados IndexedDB
async function openDatabase() {
    if (db) {
        return db; // Se o banco de dados já estiver aberto, apenas retorne a instância existente
    }

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

// Função para adicionar ou atualizar um barril
async function addOrUpdateBarrel(barrel) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readwrite');
    const store = transaction.objectStore('barrels');
    console.log('Adicionando ou atualizando barril:', barrel); // Log para depuração
    store.put(barrel); // Usa put para adicionar ou atualizar o barril

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
        request.onsuccess = () => {
            console.log('Barrels retornados:', request.result); // Log para depuração
            resolve(request.result);
        };
        request.onerror = () => reject(request.error);
    });
}

// Função para consumir água de um barril
async function consumeFromBarrel(barrelId, amount) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readwrite');
    const store = transaction.objectStore('barrels');
    const barrelRequest = store.get(barrelId);

    return new Promise((resolve, reject) => {
        barrelRequest.onsuccess = async function(event) {
            const barrel = event.target.result;
            if (barrel) {
                barrel.capacity -= amount;
                if (barrel.capacity < 0) barrel.capacity = 0; // Não permitir capacidade negativa
                store.put(barrel);
                transaction.oncomplete = () => resolve(barrel);
            } else {
                reject('Barril não encontrado');
            }
        };
        barrelRequest.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Inicializa o banco de dados (opcional, dependendo de quando você deseja abrir o banco de dados)
openDatabase().catch(error => console.error('Erro ao inicializar o banco de dados:', error));
