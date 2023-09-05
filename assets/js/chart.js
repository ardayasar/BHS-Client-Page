const ctx = document.getElementById('chartpoint');

let default_chart = 'earning_chart';

const charts = {'earning_chart': {
    type: 'line',
    data: {
        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        datasets: [
            {
            label: 'Kazanç (₺)',
            data: [2300, 1900, 4300, 2540, 3200, 2320, 9400, 13000, 11000, 3800, 9400, 5230],
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
            }
        ]
        },
    options: {
        responsive: true,
        interaction: {
        intersect: false,
        },
        scales: {
        x: {
            display: true,
            title: {
            display: false
            }
        },
        y: {
            display: true,
            title: {
            display: false,
            text: 'Kazanç (₺)'
            },
            suggestedMin: 0,
            suggestedMax: 30
        }
        }
    },
    },
'compare_chart': {
    type: 'polarArea',
    data: {
        labels: ['Trendyol', 'Hepsiburada', 'Pazarama', 'Cimri', 'N11', 'PTT'],
        datasets: [{
            label: 'Price',
            backgroundColor: ['rgba(35, 31, 32, 0.5)', 'rgba(247, 96, 2, 0.5)', 'rgba(28, 41, 238, 0.5)', 'rgba(45, 134, 231, 0.5)', 'rgba(92, 62, 188, 0.5)', 'rgba(242, 188, 5, 0.5)'],
            data: [12, 8, 6, 11, 4, 3],
            

        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        scales: {
        r: {
            pointLabels: {
            display: true,
            centerPointLabels: true,
            font: {
                size: 18
            }
            }
        }
        },
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Fiyat Fark Tablosu (%)'
        }
        }
    },
}}


var chart = new Chart(ctx, charts[default_chart]);

function change_chart(chart_name) {
    chart.destroy();
    chart = new Chart(ctx, charts[chart_name]);
}

const changerElement = document.querySelectorAll('#chart_changer');

changerElement.forEach(element => {
    element.onclick = (e) => {
        document.querySelector('.selected').setAttribute('class', 'choice_box');
        e.target.setAttribute('class', 'choice_box selected');
        chart.destroy();
        chart = new Chart(ctx, charts[e.target.attributes.chart.value]);
    }
});
