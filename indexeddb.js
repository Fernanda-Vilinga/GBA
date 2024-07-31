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

// Função para gerar um ID único para o barril
async function generateUniqueId() {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readonly');
    const store = transaction.objectStore('barrels');
    const request = store.openCursor(null, 'prev'); // Abre o cursor na ordem decrescente para pegar o maior ID

    return new Promise((resolve, reject) => {
        request.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                resolve(cursor.value.id + 1); // Retorna o próximo ID disponível
            } else {
                resolve(1); // Se não houver nenhum barril, começa com ID 1
            }
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
