/*==================================================
 ERTE5 SCOREBOARD PRO
 SYNC.JS
==================================================*/

"use strict";

const Sync = {

    channel:null,

    clientId:crypto.randomUUID(),

    listeners:[],

    init(){

        this.channel = new BroadcastChannel(
            "erte5-scoreboard"
        );

        this.channel.onmessage = (event)=>{

            const message = event.data;

            if(message.sender===this.clientId){

                return;

            }

            if(message.type==="STATE"){

                this.listeners.forEach(fn=>{

                    fn(message.state);

                });

            }

        };

    },

    send(state){

        if(!this.channel){

            return;

        }

        this.channel.postMessage({

            sender:this.clientId,

            type:"STATE",

            state:structuredClone(state)

        });

    },

    onState(callback){

        this.listeners.push(callback);

    }

};

Sync.init();

console.log("SYNC READY");