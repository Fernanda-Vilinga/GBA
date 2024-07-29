// indexeddb.js

// Função para abrir o banco de dados IndexedDB
function openDatabase() {
    const request = indexedDB.open('gestao_barril', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('volume')) {
            db.createObjectStore('volume', { keyPath: 'id' });
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

// Função para obter o volume do barril do IndexedDB
function getVolume() {
    return openDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['volume'], 'readonly');
            const store = transaction.objectStore('volume');
            const request = store.get(1);

            request.onsuccess = function(event) {
                resolve(event.target.result ? event.target.result.volume : 100); // Valor padrão de 100 litros
            };
            request.onerror = function(event) {
                reject(event.target.error);
            };
        });
    });
}

// Função para atualizar o volume no IndexedDB
function updateVolume(newVolume) {
    return openDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['volume'], 'readwrite');
            const store = transaction.objectStore('volume');
            store.put({ id: 1, volume: newVolume });

            transaction.oncomplete = function() {
                resolve();
            };
            transaction.onerror = function(event) {
                reject(event.target.error);
            };
        });
    });
}

