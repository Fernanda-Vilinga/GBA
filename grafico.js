// chart.js

let myChart;

// Função para inicializar o gráfico
function initChart(ctx) {
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Água Restante'],
            datasets: [{
                label: 'Quantidade (Litro)',
                data: [0], // Inicializa com 0, será atualizado depois
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100 // Ajuste conforme necessário
                }
            }
        }
    });
}

// Função para atualizar o gráfico com o volume atual
function updateChart(volume) {
    if (myChart) {
        myChart.data.datasets[0].data[0] = volume;
        myChart.update();
    }
}