import { useState, useEffect } from 'react';

function PlayText({ chapter }) {

    const [sayThis, setSayThis] = useState(chapter.chapterText);

    var speechUtteranceChunker = function (utt, settings, callback) {
        settings = settings || {};
        var newUtt;
        var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
        if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
            newUtt = utt;
            newUtt.text = txt;
            newUtt.addEventListener('end', function () {
                if (speechUtteranceChunker.cancel) {
                    speechUtteranceChunker.cancel = false;
                }
                if (callback !== undefined) {
                    callback();
                }
            });
        }
        else {
            var chunkLength = (settings && settings.chunkLength) || 160;
            var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
            var chunkArr = txt.match(pattRegex);
    
            if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
                //call once all text has been spoken...
                if (callback !== undefined) {
                    callback();
                }
                return;
            }
            var chunk = chunkArr[0];
            newUtt = new SpeechSynthesisUtterance(chunk);
            var x;
            for (x in utt) {
                if (utt.hasOwnProperty(x) && x !== 'text') {
                    newUtt[x] = utt[x];
                }
            }
            newUtt.addEventListener('end', function () {
                if (speechUtteranceChunker.cancel) {
                    speechUtteranceChunker.cancel = false;
                    return;
                }
                settings.offset = settings.offset || 0;
                settings.offset += chunk.length - 1;
                speechUtteranceChunker(utt, settings, callback);
            });
        }
    
        if (settings.modifier) {
            settings.modifier(newUtt);
        }
        console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
        //placing the speak invocation inside a callback fixes ordering and onend issues.
        setTimeout(function () {
            speechSynthesis.speak(newUtt);
        }, 0);
    };
    
    
    // it takes some amount of time to populate the voices array 
    // as it does so, asynchronously.
    // To fix this, we console log it after some time (say, 10 or 50 ms).
    // the resulting voices are returned in a promise so that a then
    // statement can be used to ensure that the voices get captured and then 
    // the other synchronous functionality can occur.
    function setSpeech() {
        return new Promise(
            function (resolve, reject) {
                let synth = window.speechSynthesis;
                let id;
    
                id = setInterval(() => {
                    if (synth.getVoices().length !== 0) {
                        resolve(synth.getVoices());
                        clearInterval(id);
                    }
                }, 50);
            }
        )
    }
    
    async function playText(){
        setSpeech()
        .then((voices)=>{
            let utter = new SpeechSynthesisUtterance(sayThis);
            console.log(voices);
            console.log('After');
            utter.voice = voices[2];
            //pass it into the chunking function to have it played out.
            //you can set the max number of characters by changing the chunkLength property below.
            //a callback function can also be added that will fire once the entire text has been 
            //spoken.
            speechUtteranceChunker(utter, {
                chunkLength: 120
            }, function () {
                //some code to execute when done
                console.log('utterance done');
            });
        });
    }


    return(
        <section className="p-3 d-flex justify-content-center">
            <div onClick={playText}>
                <button className="btn bg-primary">Play</button>
            </div>
        </section>
    );
}

export default PlayText;