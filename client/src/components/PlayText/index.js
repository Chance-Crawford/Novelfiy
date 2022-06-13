import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons'
import randomId from '../../utils/randomId';


function PlayText({ chapter }) {

    const [sayThis, setSayThis] = useState(chapter.chapterText);
    // the utterance that is currently being said by text to speech
    const [currentUtt, setCurrentUtt] = useState({});
    const [lastUtt, setLastUtt] = useState({});
    const [textArr, setTextArr] = useState([]);
    const [synth, setSynth] = useState({});
    const [playing, setPlaying] = useState(false);
    const [synthVoices, setSynthVoices] = useState({});
    const [rewindActive, setRewindActive] = useState(false);
    const [forwardActive, setForwardActive] = useState(false);
    const [currentVoice, setCurrentVoice] = useState({});
    const [uttSpeed, setUttSpeed] = useState(1);

    // on load of component, do this.
    useEffect(() => {
        // on load if speech synthesis is still talking, 
        // from another page, cancel the utterance.
        window.speechSynthesis.cancel();
        setSpeech()
        .then((voices)=>{ 
            setSynthVoices(voices);
            console.log(voices);
            setCurrentVoice(voices[0]);
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
            utter.voice = currentVoice;
            utter.rate = uttSpeed;
            setCurrentUtt(utter);
            synth.speak(utter);
            utter.onend = resolve;
        });
    }

    function chunkString(str, chunkLength) {
        // return str.match(new RegExp('.{1,' + offset + '}', 'g'));
        return str.match(new RegExp('[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|[\\s\\S]{1,' + chunkLength + '}$|[\\s\\S]{1,' + chunkLength + '} ', 'g'));
        //return str.match(new RegExp('.{1,' + chunkLength + '}(.|,|\s|$)', 'g'));
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

    function createCustomUtt(){

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
                setLastUtt({});
                resolve();
                clearInterval(inter);
              } else {
                  synth.cancel();
              };
            }, 10);
        });
    }

    async function subtractTen(){
        // makes sure first rewind click is finished before allowing to click again.
        if(rewindActive){
            return;
        }
        setRewindActive(true);

        let txt = {};
        const lines = 1;

        if(synth.speaking){
            txt = currentUtt;
        } else {
            txt = lastUtt;
        }

        await pauseSpeech();
        let start = textArr.indexOf(txt.text);
        console.log(start);
        if(textArr[start - lines]){
            await new Promise(resolve => {
                let utter = new SpeechSynthesisUtterance(textArr[start - lines]);
                utter.voice = currentVoice;
                utter.rate = uttSpeed;
                setLastUtt(utter);
                setRewindActive(false);
                resolve();
            });
        } else{
            setLastUtt({});
            setRewindActive(false);
        }
    }

    async function addTen(){
        // makes sure first forward click is finished before allowing to click again.
        if(forwardActive){
            return;
        }
        setForwardActive(true);

        let txt = {};
        const lines = 1;

        if(synth.speaking){
            txt = currentUtt;
        } else {
            txt = lastUtt;
        }

        await pauseSpeech();
        let start = textArr.indexOf(txt.text);
        console.log(start);
        if(textArr[start + lines]){
            await new Promise(resolve => {
                let utter = new SpeechSynthesisUtterance(textArr[start + lines]);
                utter.voice = currentVoice;
                utter.rate = uttSpeed;
                setLastUtt(utter);
                setForwardActive(false);
                resolve();
            });
        } else {
            // if there are no more lines in front of the current line.
            // set lastUtt to the last line in the chapter.
            await new Promise(resolve => {
                let utter = new SpeechSynthesisUtterance(textArr[textArr.length - 1]);
                utter.voice = currentVoice;
                utter.rate = uttSpeed;
                setLastUtt(utter);
                setForwardActive(false);
                resolve();
            });
        }
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

    function changeVoice(event){
        pauseSpeech();
        const voiceName = event.target.value;
        const voiceIndex = synthVoices.findIndex((voiceObj) => voiceObj.name === voiceName);
        if(voiceIndex){
            setUttSpeed(1);
            setCurrentVoice(synthVoices[voiceIndex]);
        } else {
            return;
        }
    }

    function changeVoiceSpeed(event){
        pauseSpeech();
        const speed = parseFloat(event.target.value);
        if(speed){
            console.log(speed);
            setUttSpeed(speed);
        } else {
            return;
        }
    }

    return(
        <section className="p-3 mt-4 mb-4 w-100 d-flex justify-content-center light-bottom-border bottom-pad">
            <div className='w-100 row'>
                <div className='col-12 col-lg-4'>
                    <div onClick={stopSpeech} className='btn icon-play-text play-text-btn'>
                        <div>
                        <FontAwesomeIcon icon={faStop} />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-center col-12 col-lg-4'>
                    <div onClick={subtractTen} className="btn play-text-btn num-btn">
                        <div className='bold'>-10</div>
                    </div>
                    <div onClick={togglePlay} className="btn icon-play-text play-text-btn">
                        
                        {!playing ? (
                            <div>
                                <FontAwesomeIcon icon={faPlay} />
                            </div>
                        ) : (
                            <div>
                                <FontAwesomeIcon icon={faPause} />
                            </div>
                        )}
                    </div>
                    <div onClick={addTen} className="btn play-text-btn num-btn">
                        <div className='bold'>+10</div>
                    </div>
                </div>
                <div className='d-flex justify-content-between col-12 col-lg-4'>
                    <div></div>
                    <div className='d-flex flex-wrap justify-content-center align-items-center'>
                        <div className='d-flex justify-content-end'>
                            <span className='bold font-18 mr-2'>Voices:</span>
                            <select name="voices" value={currentVoice.name} onChange={changeVoice} className='w-50'>
                                {synthVoices.length && synthVoices.map(voice => (
                                    <option value={voice.name} key={randomId(10)}>{voice.name.length > 16 ? (
                                        <>{voice.name.slice(0, 16)}...</>
                                    ) : (
                                        <>{voice.name}</>
                                    )}</option>
                                ))}
                            </select>
                        </div>
                        <div className='d-flex justify-content-end mt-2 mr-2'>
                            <span className='bold font-18 mr-2'>Speed:</span>
                            {currentVoice.name === 'Microsoft David - English (United States)' ||
                            currentVoice.name === 'Microsoft Mark - English (United States)' ||
                            currentVoice.name === 'Microsoft Zira - English (United States)' ? (
                                // some voices can only go to a max of 2x speed. so I added 2
                                // different select menus depending on which voice is picked.
                                <select name="voices" value={uttSpeed} onChange={changeVoiceSpeed} className='w-50'>
                                    <option value="0.25">0.25</option>
                                    <option value="0.5">0.5</option>
                                    <option value="0.75">0.75</option>
                                    <option value="1">1</option>
                                    <option value="1.25">1.25</option>
                                    <option value="1.5">1.5</option>
                                    <option value="1.75">1.75</option>
                                    <option value="2">2</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3">3</option>
                                    <option value="3.5">3.5</option>
                                </select>
                            ) : (
                                <select name="voices" value={uttSpeed} onChange={changeVoiceSpeed} className='w-50'>
                                    <option value="0.25">0.25</option>
                                    <option value="0.5">0.5</option>
                                    <option value="0.75">0.75</option>
                                    <option value="1">1</option>
                                    <option value="1.25">1.25</option>
                                    <option value="1.5">1.5</option>
                                    <option value="1.75">1.75</option>
                                    <option value="2">2</option>
                                </select>
                            )
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </section>
    );
}

export default PlayText;