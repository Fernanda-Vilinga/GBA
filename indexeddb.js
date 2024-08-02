// indexeddb.js
let db;

async function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('gestao_barril', 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('barrels')) {
                const objectStore = db.createObjectStore('barrels', { keyPath: 'id', autoIncrement: true });
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

async function addOrUpdateBarrel(barrel) {
    const db = await openDatabase();
    const transaction = db.transaction('barrels', 'readwrite');
    const store = transaction.objectStore('barrels');
    store.put(barrel);
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

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
                if (barrel.capacity < 0) barrel.capacity = 0;
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

openDatabase(); // Inicializa o banco de dados
