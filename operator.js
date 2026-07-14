/*==================================================
 ERTE5 SCOREBOARD PRO
 OPERATOR.JS
==================================================*/

"use strict";

/*==================================================
ELEMENT
==================================================*/

const el={

    playerA:document.getElementById("playerAName"),

    playerB:document.getElementById("playerBName"),

    sport:document.getElementById("sportSelect"),

    bestOf:document.getElementById("bestOfSelect"),

    serve:document.getElementById("serveSelect"),

    status:document.getElementById("matchStatus"),

    connection:document.getElementById("connectionStatus"),

    scoreA:document.getElementById("scoreA"),

    scoreB:document.getElementById("scoreB"),

    setA:document.getElementById("setA"),

    setB:document.getElementById("setB"),

    timer:document.getElementById("timer"),

    history:document.getElementById("historyBody"),

    startMatch:document.getElementById("startMatch"),

    plusA:document.getElementById("plusA"),

    minusA:document.getElementById("minusA"),

    plusB:document.getElementById("plusB"),

    minusB:document.getElementById("minusB"),

    startTimer:document.getElementById("startTimer"),

    stopTimer:document.getElementById("stopTimer"),

    resetTimer:document.getElementById("resetTimer"),

    undo:document.getElementById("undo"),

    nextSet:document.getElementById("nextSet"),

    resetMatch:document.getElementById("resetMatch")

};

/*==================================================
INIT
==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    init

);

function init(){

    bindEvents();

    bindState();

    render(

        Scoreboard.getState()

    );

}

/*==================================================
STATE
==================================================*/

function bindState(){

    Scoreboard.subscribe(

        render

    );

}

/*==================================================
EVENT
==================================================*/

let currentState = null;

function bindEvents(){


    const logoInput=document.getElementById(

    "logoInput"

);

logoInput.addEventListener(

    "change",

    function(e){

        const file=e.target.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=function(){

            window.eventLogo=

                reader.result;

        };

        reader.readAsDataURL(file);

    }

);

    el.startMatch.onclick=startMatch;

    el.plusA.onclick = ()=>{

    if(currentState && currentState.swapSide){

        Scoreboard.addPoint("B");

    }else{

        Scoreboard.addPoint("A");

    }

};

el.minusA.onclick = ()=>{

    if(currentState && currentState.swapSide){

        Scoreboard.removePoint("B");

    }else{

        Scoreboard.removePoint("A");

    }

};

el.plusB.onclick = ()=>{

    if(currentState && currentState.swapSide){

        Scoreboard.addPoint("A");

    }else{

        Scoreboard.addPoint("B");

    }

};

el.minusB.onclick = ()=>{

    if(currentState && currentState.swapSide){

        Scoreboard.removePoint("A");

    }else{

        Scoreboard.removePoint("B");

    }

};

    el.startTimer.onclick=()=>{

        Scoreboard.startTimer();

    };

    el.stopTimer.onclick=()=>{

        Scoreboard.stopTimer();

    };

    el.resetTimer.onclick=()=>{

        Scoreboard.resetTimer();

    };

    el.undo.onclick=()=>{

        Scoreboard.undo();

    };

    el.nextSet.onclick=()=>{

        Scoreboard.nextSet();

    };

    el.resetMatch.onclick=()=>{

        if(confirm(

            "Reset pertandingan?"

        )){

            Scoreboard.resetMatch();

        }

    };

}

/*==================================================
START MATCH
==================================================*/

function startMatch(){

    Scoreboard.startMatch({

    sport:el.sport.value,

    bestOf:Number(

        el.bestOf.value

    ),

    playerA:el.playerA.value,

    playerB:el.playerB.value,

    serve:el.serve.value,

    organizer:

        document.getElementById(

            "organizerInput"

        ).value,

    eventName:

        document.getElementById(

            "eventInput"

        ).value,

    eventSubtitle:

        document.getElementById(

            "subtitleInput"

        ).value,

    logo:window.eventLogo || "",

    mirror:
document.getElementById("mirrorDisplay").checked,

flipDisplay:
document.getElementById("flipDisplay").checked

});

}

/*==================================================
RENDER
==================================================*/

function render(state){

    currentState = state;

    let leftName, rightName;
    let leftScore, rightScore;
    let leftSet, rightSet;

    if(state.swapSide){

        leftName = state.playerB;
        rightName = state.playerA;

        leftScore = state.scoreB;
        rightScore = state.scoreA;

        leftSet = state.setB;
        rightSet = state.setA;

    }else{

        leftName = state.playerA;
        rightName = state.playerB;

        leftScore = state.scoreA;
        rightScore = state.scoreB;

        leftSet = state.setA;
        rightSet = state.setB;

    }

    el.playerA.value = leftName;
    el.playerB.value = rightName;

    el.scoreA.textContent = leftScore;
    el.scoreB.textContent = rightScore;

    el.setA.textContent = leftSet;
    el.setB.textContent = rightSet;

    el.status.value = state.status;

    el.timer.textContent = formatTime(state.timer);

    renderHistory(state.history);

}

/*==================================================
FORMAT TIME
==================================================*/

function formatTime(total){

    const minute=Math.floor(

        total/60

    );

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
HISTORY
==================================================*/

function renderHistory(history){

    el.history.innerHTML="";

    if(history.length===0){

        el.history.innerHTML=

        `
        <tr>

            <td>1</td>

            <td>-</td>

            <td>-</td>

        </tr>
        `;

        return;

    }

    history.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${item.set}</td>

            <td>${item.scoreA}</td>

            <td>${item.scoreB}</td>

        `;

        el.history.appendChild(row);

    });

}

/*==================================================
DISPLAY CONNECTION
==================================================*/

let heartbeat=null;

function setOnline(){

    el.connection.textContent="ONLINE";

    el.connection.classList.remove(

        "offline"

    );

    el.connection.classList.add(

        "online"

    );

    clearTimeout(heartbeat);

    heartbeat=setTimeout(()=>{

        setOffline();

    },5000);

}

function setOffline(){

    el.connection.textContent="OFFLINE";

    el.connection.classList.remove(

        "online"

    );

    el.connection.classList.add(

        "offline"

    );

}

/*==================================================
SYNC
==================================================*/

if(typeof Sync!=="undefined"){

    Sync.onState(function(){

        setOnline();

    });

}

/*==================================================
READY
==================================================*/

console.log(

    "OPERATOR READY"

);



