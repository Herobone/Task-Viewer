const os = require("os");
const osUtils = require('os-utils');
const Chart = require("chart.js");
const diskspace = require('diskspace');
const $ = require('jquery');
const ipc = require('electron').ipcRenderer;

var cpuInfo = os.cpus();
var plattform = os.platform();

//ELEMENT CONFIG
var ctxcpu = document.getElementById("cpuChart").getContext('2d');
var Sidebar = document.getElementById("Sidebar");
var overlayBg = document.getElementById("myOverlay");
var menuButton = document.getElementById("MenuButton");
var FullscreenButton = document.getElementById("FullscreenButton");

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
}

//INITIALISATE THE TIMER
//RUN THE FUNCTION EVERY 350 MS
var Timer = setInterval(function() {
    performConstant();
}, 500);

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