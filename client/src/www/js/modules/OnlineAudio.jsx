'use strict';

import React from "react";
import Wav from "./Wav_header.js";
import { connect } from "react-redux"

const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context

var convertBlock = function(buffer) {

    var incomingData = buffer;
    var l = incomingData.length;
    var outputData = new Float32Array(incomingData.length);

    for (var i = 0; i < l; i++) {
        //outputData[i] = (incomingData[i] >= 0x8000) ? - (0x10000 - incomingData[i]) / 0x8000 : 0;
        outputData[i] = incomingData[i] / 0x8000;
    }
    return outputData;
}


// factory
function createWavFromBuffer(buffer, sampleRate) {
    var wav = new Wav({
        sampleRate: sampleRate,
        channels: 2
    });
    wav.setBuffer(buffer);
    return wav;
}

// Wav -> blob
function getBlobFromWav(wav) {
    var srclist = [];
    while( !wav.eof() ){
        srclist.push(wav.getBuffer(10000));
    }
    return new Blob(srclist, {type:'audio/wav'});
}


var audioStack = [];
var nextTime = 0;
function scheduleBuffers() {
    while ( audioStack.length) {
        var buffer    = audioStack.shift();
        var source    = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        if (nextTime == 0)
            nextTime = audioCtx.currentTime;  /// add 50ms latency to work well across systems - tune this if you like
        source.start(nextTime);
        nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
    };
}




function mergeTypedArrays(a, b) {
    // Checks for truthy values on both arrays
    if(!a && !b) throw 'Please specify valid arguments for parameters a and b.';  

    // Checks for truthy values or empty arrays on each argument
    // to avoid the unnecessary construction of a new array and
    // the type comparison
    if(!b || b.length === 0) return a;
    if(!a || a.length === 0) return b;

    // Make sure that both typed arrays are of the same type
    if(Object.prototype.toString.call(a) !== Object.prototype.toString.call(b))
        throw 'The types of the two arguments passed for parameters a and b do not match.';

    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);

    return c;
}


@connect((store) => {

    return {
      loginStatus: store.Login.data.status,
        data: store.OnlineAudio.data,
    };
})


export default class OnlineAudio extends React.Component {

    constructor(){

        super();
        this._isMounted = false;
        this.buffer = new Int16Array();

    };

    componentDidMount(){

        this._isMounted = true;

    }

    componentWillReceiveProps(newProps){


        if(this._isMounted == false)
            return

        //no sound if not logged in
        if(this.props.loginStatus != "0")
            return;

        var incomingData = new Int16Array(newProps.data);
        //console.log(newProps);

        //apply some buffering
        //add new data to buffer
        this.buffer = mergeTypedArrays(this.buffer,incomingData);
        //play data if buffer reached 40KB
        if(this.buffer.length > 1024 * 40){
            var wav = createWavFromBuffer(convertBlock(this.buffer), 12800);
            var blob = getBlobFromWav(wav);
            var source = audioCtx.createBufferSource();


            // read blob and send to audio 
            var reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onloadend = function() {
                audioCtx.decodeAudioData(reader.result, function(buf) {

                    audioStack.push(buf);
                    if (audioStack.length) {
                        scheduleBuffers();
                    }
                },
                    function(e){ console.log("Error with decoding audio data " + e); }
                );
            };
            //clear buffer
            this.buffer = [];
        }

    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    render() {
        return null;
    }
};

