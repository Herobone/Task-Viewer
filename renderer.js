const os = require("os");
const osUtils = require('os-utils');
const Chart = require("chart.js");
const diskspace = require('diskspace');
const $ = require('jquery');

var cpuInfo = os.cpus();
var totalMem = osUtils.totalmem();
var plattform = os.platform();

//ELEMENT CONFIG
var ctx = document.getElementById("memoryChart").getContext('2d');
var ctxcpu = document.getElementById("cpuChart").getContext('2d');
var ctxdisk = document.getElementById("diskChart").getContext('2d');

//TABLE CONFIG
var infoofthismodelrow = document.createElement("TR");
var infoofthisspeedrow = document.createElement("TR");
var TimesHeadingrow = document.createElement("TR");
var infoofthistimerow_user = document.createElement("TR");
var infoofthistimerow_system = document.createElement("TR");
var infoofthistimerow_irq = document.createElement("TR");
var infoofthistimerow_idle = document.createElement("TR");

//TABLE INITIALISATION
cpuInfo.forEach(function(val, index) {
    var infoofthismodel = document.createElement("TH");
    infoofthismodel.innerHTML = val.model;
    infoofthismodelrow.appendChild(infoofthismodel);

    var infoofthisspeed = document.createElement("TD");
    infoofthisspeed.innerHTML = "Speed: " + val.speed + "Hz (" + (val.speed / 1000).toFixed(1) + "GHz)";
    infoofthisspeedrow.appendChild(infoofthisspeed);

    var TimesHeading = document.createElement("TH");
    TimesHeading.innerHTML = "Times";
    TimesHeadingrow.appendChild(TimesHeading);

    var infoofthistime = document.createElement("TD");
    infoofthistime.innerHTML = "User: " + val.times.user + "ms";
    infoofthistimerow_user.appendChild(infoofthistime);

    infoofthistime = document.createElement("TD");
    infoofthistime.innerHTML = "System: " + val.times.sys + "ms";
    infoofthistimerow_system.appendChild(infoofthistime);

    infoofthistime = document.createElement("TD");
    infoofthistime.innerHTML = "Irq: " + val.times.irq + "ms";
    infoofthistimerow_irq.appendChild(infoofthistime);

    infoofthistime = document.createElement("TD");
    infoofthistime.innerHTML = "Idle: " + val.times.idle + "ms";
    infoofthistimerow_idle.appendChild(infoofthistime);
});

//INSERT TABLE
document.getElementById("Info").appendChild(infoofthismodelrow);
document.getElementById("Info").appendChild(infoofthisspeedrow);
document.getElementById("Info").appendChild(TimesHeadingrow);
document.getElementById("Info").appendChild(infoofthistimerow_user);
document.getElementById("Info").appendChild(infoofthistimerow_system);
document.getElementById("Info").appendChild(infoofthistimerow_irq);
document.getElementById("Info").appendChild(infoofthistimerow_idle);


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