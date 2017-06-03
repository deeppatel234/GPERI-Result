var self = this;

function graph(spidata, backlogData) {

    if (self.myChart) {
        self.myChart.destroy();
    }

    if (self.myLineChart) {
        self.myLineChart.destroy();
    }

    var ctx = $("#spiGraph");
    self.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["SEM 1", "SEM 2", "SEM 3", "SEM 4", "SEM 5", "SEM 6", "SEM 7", "SEM 8"],
            datasets: [{
                label: 'SPI ',
                data: _.values(spidata),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 10
                    }
                }]
            }
        }
    });

    var backlogGraph = $('#backlogGraph');

    var data = {
        labels: ["SEM 1", "SEM 2", "SEM 3", "SEM 4", "SEM 5", "SEM 6", "SEM 7", "SEM 8"],
        datasets: [{
            label: "Backlog",
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',

            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: _.values(backlogData),
            spanGaps: false,
        }]
    };

    self.myLineChart = new Chart(backlogGraph, {
        type: 'line',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        }
                    }
                }]
            }
        }
    });
}

var self = this;

function semGraph(back) {
    if (self.myPieChart) {
        self.myPieChart.destroy();
    }
    $('#totalbacklogGraph').empty();
    var backlogGraph = $('#totalbacklogGraph');
    var data = {
        labels: [
            "Fail",
            "Pass"
        ],
        datasets: [{
            data: _.values(back),
            backgroundColor: [
                "#FF6384",
                "#56ff7d"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#56ff7d"
            ]
        }]
    };

    self.myPieChart = new Chart(backlogGraph, {
        type: 'pie',
        data: data,
        options: {
            animation: {
                animateScale: true
            }
        }
    });
}

function subjectGraphViewGraphFun(back) {
    if (self.subjectGraphObj) {
        self.subjectGraphObj.destroy();
    }

    var temp = $("#subjectGraphViewGraph");
    self.subjectGraphObj = new Chart(temp, {
        type: 'bar',
        data: {
            labels: ["AA", "AB", "BB", "BC", "CC", "CD", "DD", "FF"],
            datasets: [{
                label: 'Grades ',
                data: _.values(back),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
