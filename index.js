/*==================================================
ERTE5 SCOREBOARD PRO
INDEX.JS
==================================================*/

"use strict";

/*==================================================
ELEMENT
==================================================*/

const btnOperator =
document.getElementById("btnOperator");

const btnDisplay =
document.getElementById("btnDisplay");

const btnFullscreen =
document.getElementById("btnFullscreen");

const btnAbout =
document.getElementById("btnAbout");

/*==================================================
INIT
==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    init

);

function init(){

    checkBrowser();

    bindEvent();

}

/*==================================================
EVENT
==================================================*/

function bindEvent(){

    btnOperator.addEventListener(

        "click",

        openOperator

    );

    btnDisplay.addEventListener(

        "click",

        openDisplay

    );

    btnFullscreen.addEventListener(

        "click",

        openDisplayFullscreen

    );

    btnAbout.addEventListener(

        "click",

        showAbout

    );

}

/*==================================================
OPEN PAGE
==================================================*/

function openOperator(){

    window.open(

        "operator.html",

        "_blank"

    );

}

function openDisplay(){

    window.open(

        "display.html",

        "_blank"

    );

}

function openDisplayFullscreen(){

    const win = window.open(

        "display.html",

        "_blank"

    );

    if(!win){

        alert(

            "Popup diblokir browser."

        );

    }

}

/*==================================================
ABOUT
==================================================*/

function showAbout(){

    alert(

`ERTE5 DIGITAL SCOREBOARD

Version 1.0

Professional Tournament Edition

Developed using
HTML
CSS
JavaScript

Realtime Sync
BroadcastChannel API`

    );

}

/*==================================================
CHECK BROWSER
==================================================*/

function checkBrowser(){

    if(

        !("BroadcastChannel" in window)

    ){

        alert(

`Browser Anda tidak mendukung BroadcastChannel.

Gunakan:

Google Chrome
Microsoft Edge
Firefox`

        );

    }

}

/*==================================================
READY
==================================================*/

console.log(

"ERTE5 INDEX READY"

);