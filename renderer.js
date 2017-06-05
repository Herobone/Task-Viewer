const os = require("os");
const osUtils = require('os-utils');
const Chart = require("chart.js");
const diskspace = require('diskspace');
const $ = require('jquery');
const ipc = require('electron').ipcRenderer;

var cpuInfo = os.cpus();
var totalMem = osUtils.totalmem();
var plattform = os.platform();

//ELEMENT CONFIG
var ctx = document.getElementById("memoryChart").getContext('2d');
var ctxcpu = document.getElementById("cpuChart").getContext('2d');
var ctxdisk = document.getElementById("diskChart").getContext('2d');
var Sidebar = document.getElementById("Sidebar");
var overlayBg = document.getElementById("myOverlay");
var menuButton = document.getElementById("MenuButton");
var FullscreenButton = document.getElementById("FullscreenButton");

var cpuLink = document.getElementById("cpu-link");
//PARTS OF THIS FUNCTON WILL BE PERFORMED CONSTANTLY
function performConstant() {
    var cpuUsage = process.cpuUsage();
    var freemem = osUtils.freemem();
    var freememPercent = ((freemem / totalMem) * 100).toFixed(2);
    var usedmemPercent = (100 - freememPercent).toFixed(2);

    osUtils.cpuUsage(function(v) {
        document.getElementById("cpuUsagePercent").innerHTML = (v * 100).toFixed(2);
        var cpuChart = new Chart(ctxcpu, {
            type: 'pie',
            data: {
                labels: ["Used", "Free"],
                datasets: [{
                    data: [(v * 100).toFixed(2), (100 - (v * 100)).toFixed(2)],
                    backgroundColor: [
                        'rgba(255, 0, 0, 1)',
                        'rgba(0, 225, 0, 1)'
                    ],
                    borderColor: [
                        'rgba(255, 0, 0, 1)',
                        'rgba(0, 225, 0, 1)'
                    ]
                }]
            },
            options: {
                animation: false,
                responsive: false,
                legend: {
                    display: false
                }
            }
        });
    });
    document.getElementById("freeMEMpercent").innerHTML = usedmemPercent + "%";
    var memoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Used", "Free"],
            datasets: [{
                data: [usedmemPercent, freememPercent],
                backgroundColor: [
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 225, 0, 1)'
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 225, 0, 1)'
                ]
            }]
        },
        options: {
            animation: false,
            responsive: false,
            legend: {
                display: false
            }
        }
    });
}

//INITIALISATE THE TIMER
//RUN THE FUNCTION EVERY 350 MS
var Timer = setInterval(function() {
    performConstant();
}, 500);

//PARTS OF THIS FUNCTON WILL BE PERFORMED CONSTANTLY
function performConstantSlow() {
    if (plattform === "win32") {
        diskspace.check('C', function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.satus !== "NOTFOUND" || result.satus !== "NOTREADY" || result.satus !== "STDERR") {
                document.getElementById("freeDiskSpace").innerHTML = (result.free / 1024 / 1024 / 1024).toFixed(2) + " GB";

                var diskChart = new Chart(ctxdisk, {
                    type: 'pie',
                    data: {
                        labels: ["Used", "Free"],
                        datasets: [{
                            data: [((result.total / result.free) * 10).toFixed(2), (100 - ((result.total / result.free) * 10)).toFixed(2)],
                            backgroundColor: [
                                'rgba(255, 0, 0, 1)',
                                'rgba(0, 225, 0, 1)'
                            ],
                            borderColor: [
                                'rgba(255, 0, 0, 1)',
                                'rgba(0, 225, 0, 1)'
                            ]
                        }]
                    },
                    options: {
                        animation: false,
                        responsive: false,
                        legend: {
                            display: false
                        }
                    }
                });
            }
        });
    } else {
        diskspace.check('/', function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.satus !== "NOTFOUND" || result.satus !== "NOTREADY" || result.satus !== "STDERR") {
                document.getElementById("freeDiskSpace").innerHTML = ((((result.free / 1024) / 1024) / 1024) / 1024) + "GB";

                var diskChart = new Chart(ctxdisk, {
                    type: 'pie',
                    data: {
                        labels: ["Used", "Free"],
                        datasets: [{
                            data: [(result.total / result.used) * 10, (result.total / result.free) * 10],
                            backgroundColor: [
                                'rgba(255, 0, 0, 1)',
                                'rgba(0, 225, 0, 1)'
                            ],
                            borderColor: [
                                'rgba(255, 0, 0, 1)',
                                'rgba(0, 225, 0, 1)'
                            ]
                        }]
                    },
                    options: {
                        animation: false,
                        responsive: false,
                        legend: {
                            display: false
                        }
                    }
                });
            }
        });
    }
}

//INITIALISATE THE TIMER
//RUN THE FUNCTION EVERY 60 SEC
var SlowTimer = setInterval(function() {
    performConstantSlow();
}, 60000);
performConstantSlow();

function w3_open() {
    if (Sidebar.style.display === 'block') {
        Sidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        Sidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

function w3_close() {
    Sidebar.style.display = "none";
    overlayBg.style.display = "none";
}

//EVENT LISTENER

overlayBg.addEventListener('click', function(clickEvent) {
    w3_close();
    console.log("Clicked Overlay!");
});

menuButton.addEventListener('click', function(clickEvent) {
    w3_open();
    console.log("Clicked Menu Button!");
});

FullscreenButton.addEventListener('click', function(clickEvent) {
    ipc.send("togglefullscreen");
});

cpuLink.addEventListener('click', function(clickEvent) {
    ipc.send("goToPage", "CPU.html");
});

document.getElementById("cpuChart").addEventListener('click', function(clickEvent) {
    ipc.send("goToPage", "CPU.html");
});

document.getElementById("cpuUsagePercent").addEventListener('click', function(clickEvent) {
    ipc.send("goToPage", "CPU.html");
});