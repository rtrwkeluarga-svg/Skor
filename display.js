/*==================================================
 ERTE5 SCOREBOARD PRO
 DISPLAY.JS
==================================================*/

"use strict";

/*==================================================
ELEMENT
==================================================*/

const el={
    
    panelA:document.getElementById("playerA"),

    panelB:document.getElementById("playerB"),

    playerA:document.getElementById("playerAName"),

    playerB:document.getElementById("playerBName"),

    scoreA:document.getElementById("scoreA"),

    scoreB:document.getElementById("scoreB"),

    setA:document.getElementById("setA"),

    setB:document.getElementById("setB"),

    timer:document.getElementById("timer"),

    status:document.getElementById("matchStatus"),

    currentSet:document.getElementById("currentSet"),

    serveA:document.getElementById("serveA"),

    serveB:document.getElementById("serveB"),

    clock:document.getElementById("clock")

};

let lastScoreA = 0;

let lastScoreB = 0;

let lastStatus = "READY";

let overlayTimer=null;

let lastOverlay = "";

/*==================================================
INIT
==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    init

);

function init(){

    startClock();

    bindSync();

    render(

        Scoreboard.getState()

    );

}

/*==================================================
SYNC
==================================================*/

function bindSync(){

    Sync.onState(function(state){

        Scoreboard.update(state);

        render(state);

    });

}

function showOverlay(title,player="",score=""){

    const overlay=document.getElementById("overlay");

    if(!overlay) return;

    document.getElementById("overlayTitle").textContent=title;
    document.getElementById("overlayPlayer").textContent=player;
    document.getElementById("overlayScore").textContent=score;

    overlay.classList.remove("show");

    void overlay.offsetWidth;

    overlay.classList.add("show");

    clearTimeout(window.overlayTimer);

    window.overlayTimer=setTimeout(()=>{

        overlay.classList.remove("show");

    },3000);

}

/*==================================================
RENDER
==================================================*/

function render(state){

    let leftName, rightName;
let leftScore, rightScore;
let leftSet, rightSet;
let serveLeft, serveRight;

if(state.swapSide){

    leftName = state.playerB;
    rightName = state.playerA;

    leftScore = state.scoreB;
    rightScore = state.scoreA;

    leftSet = state.setB;
    rightSet = state.setA;

    serveLeft = (state.serve === "B");
    serveRight = (state.serve === "A");

}else{

    leftName = state.playerA;
    rightName = state.playerB;

    leftScore = state.scoreA;
    rightScore = state.scoreB;

    leftSet = state.setA;
    rightSet = state.setB;

    serveLeft = (state.serve === "A");
    serveRight = (state.serve === "B");

}

    // =========================
    // PLAYER
    // =========================

    el.playerA.textContent = leftName;
    el.playerB.textContent = rightName;

    // =========================
    // SCORE ANIMATION
    // =========================

    if(state.scoreA !== lastScoreA){

        el.scoreA.classList.remove("animate");
        void el.scoreA.offsetWidth;
        el.scoreA.classList.add("animate");

    }

    if(state.scoreB !== lastScoreB){

        el.scoreB.classList.remove("animate");
        void el.scoreB.offsetWidth;
        el.scoreB.classList.add("animate");

    }

    el.scoreA.textContent = leftScore;
    el.scoreB.textContent = rightScore;

    // =========================
    // SET
    // =========================

    el.setA.textContent = leftSet;
    el.setB.textContent = rightSet;

    el.currentSet.textContent =
        "SET " + state.currentSet;

    // =========================
    // TIMER
    // =========================

    el.timer.textContent =
        formatTime(state.timer);

    // =========================
    // STATUS
    // =========================

    el.status.textContent =
        state.status;

    // =========================
    // EVENT
    // =========================

    document.getElementById("organizer").textContent =
        state.organizer;

    document.getElementById("eventName").textContent =
        state.eventName;

    document.getElementById("eventCategory").textContent =
        state.eventSubtitle;


    // =========================
// MIRROR DISPLAY
// =========================

const board = document.querySelector(".board");
const playerA = document.getElementById("playerA");
const center = document.querySelector(".center");
const playerB = document.getElementById("playerB");

if(state.flipDisplay){

    board.appendChild(playerB);
    board.appendChild(center);
    board.appendChild(playerA);

}else{

    board.appendChild(playerA);
    board.appendChild(center);
    board.appendChild(playerB);

}

if(state.mirror){

    document.body.classList.add("mirror");

}else{

    document.body.classList.remove("mirror");

}



    // =========================
    // LOGO
    // =========================

    const logo=document.querySelector(".logo");

    if(logo && state.logo){

        logo.src=state.logo;

    }

    // =========================
    // SERVE
    // =========================

    el.serveA.textContent =
    serveLeft ? "🟢 SERVE" : "";

    el.serveB.textContent =
    serveRight ? "🟢 SERVE" : "";

    el.panelA.classList.remove("activeServe");
    el.panelB.classList.remove("activeServe");

    if(serveLeft){

    el.panelA.classList.add("activeServe");

}else{

    el.panelB.classList.add("activeServe");

}

    // =========================
    // OVERLAY
    // =========================

    if(state.overlay !== lastOverlay){

        switch(state.overlay){

            case "SET POINT":

                showOverlay("SET POINT");

                break;

            case "MATCH POINT":

                showOverlay("MATCH POINT");

                break;

            case "WINNER":

                showOverlay(

                    "🏆 WINNER",

                    state.winner,

                    state.scoreA+" - "+state.scoreB

                );

                break;

        }

        lastOverlay=state.overlay;

    }

    // =========================
    // SAVE LAST VALUE
    // =========================

    lastScoreA=state.scoreA;
    lastScoreB=state.scoreB;
    lastStatus=state.status;

}


/*==================================================
ANIMATION
==================================================*/

/*==================================================
FORMAT TIME
==================================================*/

function formatTime(total){

    const minute=Math.floor(total/60);

    const second=total%60;

    return String(minute)

        .padStart(2,"0")

        +

        ":"

        +

        String(second)

        .padStart(2,"0");

}

/*==================================================
CLOCK
==================================================*/

function startClock(){

    updateClock();

    setInterval(

        updateClock,

        1000

    );

}

function updateClock(){

    const now=new Date();

    el.clock.textContent=

        now.toLocaleTimeString(

            "id-ID"

        );

}

/*==================================================
READY
==================================================*/

