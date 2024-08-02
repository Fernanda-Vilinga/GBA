// chart.js

let myChart;

// Função para inicializar o gráfico
function initChart(ctx, initialCapacity) {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Água Restante'],
            datasets: [{
                label: 'Quantidade (Litro)',
                data: [initialCapacity], // Inicializa com a capacidade total
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: initialCapacity // Ajusta o máximo conforme a capacidade inicial
                }
            }
        }
    });
}

// Função para atualizar o gráfico com o volume restante
function updateChart(removedAmount, initialCapacity) {
    if (myChart) {
        const remainingAmount = initialCapacity - removedAmount;
        myChart.data.datasets[0].data[0] = remainingAmount;
        myChart.options.scales.y.max = initialCapacity; // Ajusta o máximo do eixo y
        myChart.update();
    }
}
