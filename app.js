/*==================================================
 ERTE5 SCOREBOARD PRO
 APP.JS
 VERSION 1.0
==================================================*/

"use strict";

const Scoreboard = {

    /*
    ==========================================
    CONFIG
    ==========================================
    */

    config:{

        badminton:{
            targetScore:21,
            maxScore:30,
            bestOf:3
        },

        tabletennis:{
            targetScore:11,
            bestOf:5
        }

    },

    /*
    ==========================================
    STATE
    ==========================================
    */

    state:{

    sport:"badminton",

    bestOf:3,

    playerA:"PLAYER A",

    playerB:"PLAYER B",

    serve:"A",

    scoreA:0,

    scoreB:0,

    setA:0,

    setB:0,

    currentSet:1,

    timer:0,

    timerRunning:false,

    status:"READY",

    overlay:"",

    history:[],

    organizer:"KARANG TARUNA RT5 RW12",

    eventName:"TURNAMEN",

    eventSubtitle:"HUT RI KE-81 TAHUN 2026",

    swapSide:false,

    mirror:false,

    flipDisplay:false,

    logo:""


},

   

    /*
    ==========================================
    OBSERVER
    ==========================================
    */

    listeners:[],

        /*
    ==========================================
    UNDO STACK
    ==========================================
    */

    undoStack:[],

    /*
    ==========================================
    SUBSCRIBE
    ==========================================
    */

    subscribe(callback){

        this.listeners.push(callback);

    },

    /*
    ==========================================
    NOTIFY
    ==========================================
    */

    notify(){

        const snapshot=

            structuredClone(

                this.state

            );

        this.listeners.forEach(fn=>{

            fn(snapshot);

        });

    },

    /*
    ==========================================
    GET STATE
    ==========================================
    */

    getState(){

        return structuredClone(

            this.state

        );

    },

    /*
    ==========================================
    UPDATE STATE
    ==========================================
    */

    update(data){

        Object.assign(

            this.state,

            data

        );

        this.notify();

    },

    /*
    ==========================================
    SAVE STATE
    ==========================================
    */

    saveState(){

        this.undoStack.push(

            structuredClone(this.state)

        );

        if(this.undoStack.length>50){

            this.undoStack.shift();

        }

    },

        /*
    ==========================================
    UNDO
    ==========================================
    */

    undo(){

        if(this.undoStack.length===0){

            return;

        }

        Object.assign(
    this.state,
    this.undoStack.pop()
     );

     this.notify();


    },

    /*
    ==========================================
    START MATCH
    ==========================================
    */

    startMatch(setting){

        this.state.organizer = setting.organizer;

        this.state.eventName = setting.eventName;

        this.state.eventSubtitle = setting.eventSubtitle;

        this.state.logo = setting.logo;

        this.state.mirror = setting.mirror;

        this.state.sport=setting.sport;

        this.state.bestOf = setting.bestOf;

        this.state.playerA=setting.playerA;

        this.state.playerB=setting.playerB;

        this.state.serve=setting.serve;

        this.state.firstServer = setting.serve;

        this.state.scoreA=0;

        this.state.scoreB=0;

        this.state.setA=0;

        this.state.setB=0;

        this.state.currentSet=1;

        this.state.timer=0;

        this.state.timerRunning=false;

        this.state.status="MATCH STARTED";

        this.state.history=[];

        this.state.swapSide = false;

        this.state.flipDisplay = setting.flipDisplay;

        this.notify();

    },

    /*
==========================================
ADD POINT
==========================================
*/

addPoint(player){

    this.saveState();

    // Tambah skor
    if(player==="A"){
        this.state.scoreA++;
    }else{
        this.state.scoreB++;
    }

    // ==========================
    // AUTO SERVE
    // ==========================

    if(this.state.sport==="badminton"){

        // Rally Point
        this.state.serve=player;

    }else{

        const total=this.state.scoreA+this.state.scoreB;

        const first=this.state.firstServer || "A";

        // BELUM DEUCE
        if(!(this.state.scoreA>=10 && this.state.scoreB>=10)){

            if(Math.floor(total/2)%2===0){

                this.state.serve=first;

            }else{

                this.state.serve=
                    first==="A"
                    ?"B"
                    :"A";

            }

        }

        // DEUCE
        else{

            if(total%2===0){

                this.state.serve=first;

            }else{

                this.state.serve=
                    first==="A"
                    ?"B"
                    :"A";

            }

        }

    }

    // Cek apakah set selesai
    this.checkWinner();

    // Overlay hanya jika pertandingan belum selesai
    if(this.state.status!=="FINISHED"){
        this.updateOverlay();
    }

    this.notify();

},

    /*
==========================================
FINISH SET
==========================================
*/

finishSet(winner){

    this.state.history.push({

        set:this.state.currentSet,

        scoreA:this.state.scoreA,

        scoreB:this.state.scoreB

    });

    if(winner==="A"){

        this.state.setA++;

    }else{

        this.state.setB++;

    }

    // Server awal SET berikutnya bergantian
    this.state.firstServer =
        this.state.firstServer==="A"
        ?"B"
        :"A";

    this.state.serve=this.state.firstServer;

    // Tukar posisi kiri dan kanan setiap selesai SET
    this.state.swapSide = !this.state.swapSide;

    this.checkMatchWinner();

},

    

    /*
==========================================
CHECK MATCH WINNER
==========================================
*/

checkMatchWinner(){

    const needWin=Math.ceil(this.state.bestOf/2);

    if(this.state.setA>=needWin){

        this.state.status="FINISHED";
        this.state.winner=this.state.playerA;
        this.state.overlay="WINNER";

        this.stopTimer();

        this.notify();

        return;

    }

    if(this.state.setB>=needWin){

        this.state.status="FINISHED";
        this.state.winner=this.state.playerB;
        this.state.overlay="WINNER";

        this.stopTimer();

        this.notify();

        return;

    }

    this.state.currentSet++;

    this.state.scoreA=0;
    this.state.scoreB=0;

    this.state.overlay="";

    this.state.status="LIVE";

},

checkWinner(){

    const cfg=this.config[this.state.sport];

    const a=this.state.scoreA;
    const b=this.state.scoreB;

    let win=false;
    let winner="";

    if(this.state.sport==="badminton"){

        if(
            (a>=21 || b>=21) &&
            Math.abs(a-b)>=2
        ){
            win=true;
        }

        if(a===30 || b===30){
            win=true;
        }

    }else{

        if(
            (a>=11 || b>=11) &&
            Math.abs(a-b)>=2
        ){
            win=true;
        }

    }

    if(!win) return;

    winner=a>b?"A":"B";

    this.finishSet(winner);

},

updateOverlay(){

    const cfg=this.config[this.state.sport];

    const target=
        this.state.sport==="badminton"
        ?21
        :11;

    const need=Math.ceil(this.state.bestOf/2);

    const a=this.state.scoreA;
    const b=this.state.scoreB;

    const setA=this.state.setA;
    const setB=this.state.setB;

    this.state.overlay="";

    if(
        setA===need-1 &&
        a>=target-1
    ){

        this.state.overlay="MATCH POINT";

        return;

    }

    if(
        setB===need-1 &&
        b>=target-1
    ){

        this.state.overlay="MATCH POINT";

        return;

    }

    if(a>=target-1 || b>=target-1){

        this.state.overlay="SET POINT";

    }

},

stopTimer(){

    clearInterval(this.timerInterval);

    this.state.timerRunning=false;

},

startTimer(){

    if(this.state.timerRunning) return;

    this.state.timerRunning=true;

    this.timerInterval=setInterval(()=>{

        this.state.timer++;

        this.notify();

    },1000);

},

removePoint(player){

    this.saveState();

    if(player==="A" && this.state.scoreA>0){

        this.state.scoreA--;

    }

    if(player==="B" && this.state.scoreB>0){

        this.state.scoreB--;

    }

    this.notify();

},

/*
==========================================
RESET MATCH
==========================================
*/

resetMatch(){

    this.state.scoreA = 0;
    this.state.scoreB = 0;

    this.state.setA = 0;
    this.state.setB = 0;

    this.state.currentSet = 1;

    this.state.serve = this.state.firstServer || "A";

    this.state.status = "READY";

    this.state.overlay = "";

    this.state.winner = "";

    this.state.history = [];

    this.stopTimer();

    this.state.timer = 0;

    this.state.swapSide = false;

    this.notify();

},

    

};

    /*==================================================
AUTO SYNC
==================================================*/

Scoreboard.subscribe(function(state){

    if(typeof Sync!=="undefined"){

        Sync.send(state);

    }

    
});

console.log("APP READY");