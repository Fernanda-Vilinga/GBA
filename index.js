document.addEventListener('DOMContentLoaded', async () => {
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
    let selectedBarrelId = null; // Armazena o ID do barril selecionado

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
    const quantityGarrafa= document.getElementById('quantityGarrafa');
    const decrementGarrafa = document.getElementById('decrementGarrafa');
    const incrementGarrafa = document.getElementById('incrementGarrafa');
  
 
    // Eventos de alerta para imagens
    garrafaImg.addEventListener('click', function() {
        alert('Seleccione um barril para consumires água!');
    });
    copoImg.addEventListener('click', function() {
        alert('Seleccione um barril para consumires água!');
    });

    
      // Abrir modal ao clicar na imagem da garrafa 
    garrafaImageG.addEventListener('click', function() {
        garrafaModal.style.display = 'block';
        copoModal.style.display = 'none';
    
    });
  // Fechar modal ao clicar no botão de fechar da garrafa
  garrafaSpan.addEventListener('click', function() {
    garrafaModal.style.display = 'none';
    copoModal.style.display = 'none';
});
// Fechar modal se clicar fora da área do modal da garrafa
window.addEventListener('click', function(event) {
    if (event.target === copoModal) {
        copoModal.style.display = 'none';
        garrafaModal.style.display = 'none';
    }
});
    // Decrementar quantidade de garrafa
    decrementGarrafa.addEventListener('click', function() {
        quantityGarrafa.value = Math.max(parseInt(quantityGarrafa.value) - 1, 0);
    });
     // Incrementar quantidade da garrafa
     incrementGarrafa.addEventListener('click', function() {
        quantityGarrafa.value = parseInt (quantityGarrafa.value) + 1;
    });
    // Atualizar gráfico ao confirmar a quantidade consumida do garrafa
    confirmButtonGarrafa.addEventListener('click', async function() {
        garrafaModal.style.display = 'none';
        const quantity = parseInt(quantityGarrafa.value);
        const waterConsumed = quantity ;

        if (!isNaN(quantity) && quantity >= 0) {
            const currentVolume = await getVolume();
            const newVolume = Math.max(currentVolume - waterConsumed, 0);

            await updateVolume(newVolume);
            updateChart(newVolume);
            garrafaModal.style.display = 'none';
        } else {
            alert('Por favor, insira uma quantidade válida de copos.');
        }
    });
  
      // Abrir modal ao clicar na imagem do copo
      copoImgC.addEventListener('click', function() {
     
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
        const waterConsumed = quantity ;

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
   

    
   
    // Abrir o modal de cadastro e gerar ID
  
function generateRandomId() {
    return Math.floor(Math.random() * 10000) + 1; // Gera um número aleatório entre 1 e 10000
}
 // Função para mostrar o modal de cadastro
addBarrelButton.onclick = async () => {
    barrelModal.style.display = 'block';
    const barrelId = generateRandomId(); // Gera um ID automático
    document.getElementById('barrelId').value = barrelId; // Define o ID no campo de input
};



    // Fechar o modal de cadastro
    closeBarrelModal.onclick = () => {
        barrelModal.style.display = 'none';
    };
    
    // Registrar novo barril
registerBarrelButton.onclick = async () => {
    try {
        const barrelId = parseInt(document.getElementById('barrelId').value, 10);
        const barrelCapacity = parseFloat(document.getElementById('barrelCapacity').value);
        
        if (isNaN(barrelId) || isNaN(barrelCapacity) || barrelCapacity <= 0) {
            alert('Por favor, insira um ID e uma capacidade válidos.');
            return;
        }
        
        await addBarrel({ id: barrelId, capacity: barrelCapacity });
        barrelModal.style.display = 'none';
        await updateBarrelList(); // Atualiza a lista de barris
    } catch (error) {
        console.error('Erro ao registrar barril:', error);
    }
};

   // Função para atualizar a lista de barris
async function updateBarrelList() {
    barrelList.innerHTML = ''; // Limpa a lista antes de atualizar
    try {
        const barrels = await getAllBarrels(); // Verifique se esta função está retornando a lista correta
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

    // Registrar novo barril
registerBarrelButton.onclick = async () => {
    try {
        const barrelId = parseInt(document.getElementById('barrelId').value, 10);
        const barrelCapacity = parseFloat(document.getElementById('barrelCapacity').value);
        
        if (isNaN(barrelId) || isNaN(barrelCapacity) || barrelCapacity <= 0) {
            alert('Por favor, insira um ID e uma capacidade válidos.');
            return;
        }
        
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

    // Confirmar consumo com copo
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

    // Confirmar consumo com garrafa
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

// index.js
document.addEventListener('DOMContentLoaded', () => {
    // Função para abrir e fechar modais
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Event listeners para os botões de incrementar e decrementar
    document.getElementById('decrement').addEventListener('click', () => {
        updateQuantity('quantity', false);
    });
    document.getElementById('increment').addEventListener('click', () => {
        updateQuantity('quantity', true);
    });

    document.getElementById('decrementGarrafa').addEventListener('click', () => {
        updateQuantity('quantityGarrafa', false);
    });
    document.getElementById('incrementGarrafa').addEventListener('click', () => {
        updateQuantity('quantityGarrafa', true);
    });

    // Event listener para o botão de confirmar (Copo)
    document.getElementById('confirmButton').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        updateChart(quantity); // Atualiza o gráfico
        closeModal('myModal'); // Fecha o modal
    });

    // Event listener para o botão de confirmar (Garrafa)
    document.getElementById('confirmButtonGarrafa').addEventListener('click', () => {
        const quantityGarrafa = parseInt(document.getElementById('quantityGarrafa').value);
        updateChart(quantityGarrafa); // Atualiza o gráfico
        closeModal('garrafaModal'); // Fecha o modal
    });

    // Adiciona event listeners aos botões de fechar modais
    document.querySelector('.close').addEventListener('click', () => closeModal('myModal'));
    document.querySelector('.close-garrafa').addEventListener('click', () => closeModal('garrafaModal'));

    // Fecha o modal se o usuário clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('myModal')) {
            closeModal('myModal');
        }
        if (event.target === document.getElementById('garrafaModal')) {
            closeModal('garrafaModal');
        }
    });

    // Função para atualizar a quantidade
    function updateQuantity(id, increment) {
        const input = document.getElementById(id);
        let value = parseInt(input.value);
        if (increment) {
            value += 1;
        } else {
            value = Math.max(0, value - 1); // Não permitir valores negativos
        }
        input.value = value;
    }
});
