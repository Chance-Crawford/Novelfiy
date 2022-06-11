import { useState, useEffect } from 'react';

function PlayText({ chapter }) {

    const [sayThis, setSayThis] = useState(chapter.chapterText);
    // the utterance that is currently being said by text to speech
    const [currentUtt, setCurrentUtt] = useState({});
    const [lastUtt, setLastUtt] = useState({});
    const [textArr, setTextArr] = useState([]);
    const [synth, setSynth] = useState({});
    const [playing, setPlaying] = useState('None');
    const [synthVoices, setSynthVoices] = useState({});

    // on google chrome speech synthesis will usually cut out after about 
    // 200 characters in an utterance. This is an open source well known
    // workaround to break the uterance string into smaller utterances and play
    // them one after another. The utterances are split at punctuation.
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
            setCurrentUtt(newUtt);
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

    useEffect(() => {
        setSpeech()
        .then((voices)=>{ 
            setSynthVoices(voices);
            console.log(voices);
        });
    }, []);

    useEffect(() => {
        console.log(lastUtt);
        // console.log(currentUtt);
        console.log(synth);
    }, [currentUtt, lastUtt, synth]);
    
    
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
                setSynth(synth);
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

    async function setUtter(i, arr) {
        return new Promise(resolve => {
                    let utter = new SpeechSynthesisUtterance(arr[i]);
                    utter.voice = synthVoices[0];
                    setCurrentUtt(utter);
                    synth.speak(utter);
                    utter.onend = resolve;

                
                
    
                // id = setInterval(() => {
                //     if (utter) {
                //         resolve(synth.speak(utter));
                //         clearInterval(id);
                //     }
                // }, 50);
        });

    }

    function chunkString(str, offset) {
        return str.match(new RegExp('.{1,' + offset + '}', 'g'));
    }
    
    async function playText(){
        // if text to speech voice is currently speaking when
        // play button is pressed, return and do nothing.
        if(synth.speaking){
            return;
        }
        if(lastUtt.text && textArr.length){
            let start = textArr.indexOf(lastUtt.text);
            // this boolean will tell if the last utterance was at the
            // end of the array or not.
            let refresh = false
            // if at end of chapter utterance array. set the refresh to true.
            // This will refresh the lastUtt state, so that when synth stops speaking
            // last line, and play button is hit again. It starts at the beginning
            // of the chapter like originally.
            if(start + 1 === textArr.length){
                refresh = true;
            }
            if(!refresh){
                let newArr = textArr.slice(start);
                for(var i = 0; i < newArr.length; i++){
                    await setUtter(i, newArr);
                }
            }else{
                // set lastUtt state to none.
                setLastUtt({});
                // it will still play the last line in the utterance array
                // that is still saved in the textArr state.
                // if pause is hit again while playing this last line, the 
                // lastUtt array will get set to the last line because of the
                // logic defined in the pauseSpeech function.
                // if pause button is not pressed while playing the last line,
                // the lastUtt state will stay blank and the synth object will 
                // stop speaking.
                let newArr = textArr.slice(start);
                for(var i = 0; i < newArr.length; i++){
                    await setUtter(i, newArr);
                }
            } 
        } else {
            let offset = 120;
            let createArr = chunkString(sayThis, offset);
            setTextArr(createArr);
            // console.log(createArr)
            for(var i = 0; i < createArr.length; i++){
                await setUtter(i, createArr);
            }
        }
        
        
    }

    async function pauseSpeech(){
        // since synth.cancel only clears the current utterance,
        // set it into set interval in order to clear all utterances until
        // the synth object is no longer speaking.
        let count = 0;
        await new Promise(resolve => {
            const inter = setInterval(() => {
              if (!synth.speaking) {
                resolve();
                clearInterval(inter);
              } else {
                  // as soon as pause button is hit, get the current utterance
                  // and save it in a new state. increment the counter so that this only
                  // happens once, if not the current utterance will keep getting reset
                  // with each synth.cancel.
                  if(count === 0){
                    setLastUtt(currentUtt);
                    count += 1;
                  }
                  synth.cancel();
              };
            }, 10);
        });
    }




    return(
        <section className="p-3 d-flex justify-content-center">
            <div onClick={playText}>
                <button className="btn bg-primary">Play</button>
            </div>
            <div onClick={pauseSpeech}>
                <button className="btn bg-danger">Pause</button>
            </div>
        </section>
    );
}

export default PlayText;