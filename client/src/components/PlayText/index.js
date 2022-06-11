import { useState, useEffect } from 'react';

function PlayText({ chapter }) {

    const [sayThis, setSayThis] = useState(chapter.chapterText);
    // the utterance that is currently being said by text to speech
    const [currentUtt, setCurrentUtt] = useState({});
    const [lastUtt, setLastUtt] = useState({});
    const [textArr, setTextArr] = useState([]);
    const [synth, setSynth] = useState({});
    const [synthSpeaking, setSynthSpeaking] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [synthVoices, setSynthVoices] = useState({});

    // on load of component, do this.
    useEffect(() => {
        // on load if speech synthesis is still talking, 
        // from another page, cancel the utterance.
        window.speechSynthesis.cancel();
        setSpeech()
        .then((voices)=>{ 
            setSynthVoices(voices);
            console.log(voices);
        });
    }, []);

    // another precaution to stop speech when leaving the page.
    useEffect(() => {
        window.addEventListener("beforeunload", stopSpeech);
        return () => {
          window.removeEventListener("beforeunload", stopSpeech);
        };
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
                // changes play button back to pause after the synth finishes reading
                // all chapter lines
                if(!synth.speaking){
                    setPlaying(false);
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
                // changes play button back to pause after the synth finishes reading
                // all chapter lines
                if(!synth.speaking){
                    setPlaying(false);
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
            if(!synth.speaking){
                setPlaying(false);
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

    async function stopSpeech(){
        // since synth.cancel only clears the current utterance,
        // set it into set interval in order to clear all utterances until
        // the synth object is no longer speaking.
        await new Promise(resolve => {
            const inter = setInterval(() => {
              if (!synth.speaking) {
                resolve();
                clearInterval(inter);
              } else {
                  synth.cancel();
              };
            }, 10);
        });
    }

    

    function togglePlay(){
        const play = !playing
        setPlaying(play);

        if(play){
            playText();
        } else {
            pauseSpeech();
        }
    }

    return(
        <section className="p-3 d-flex justify-content-center">
            <div onClick={togglePlay}>
                <button className="btn bg-primary">{!playing ? 'Play' : 'Pause'}</button>
            </div>
        </section>
    );
}

export default PlayText;