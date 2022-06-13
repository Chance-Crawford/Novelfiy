export const stopSpeech = async () => {
    // since synth.cancel only clears the current utterance,
    // set it into set interval in order to clear all utterances until
    // the synth object is no longer speaking.
    await new Promise(resolve => {
        const inter = setInterval(() => {
          let synth = window.speechSynthesis;
          if (!synth.speaking) {
            synth.cancel();
            resolve();
            clearInterval(inter);
          } else {
            synth.cancel();
          };
        }, 10);
    });
}

// when link elements are clicked, sometimes the speech synthesis will glitch and 
// not fully cancel. This is insurance that forces speech interval to cancel
// when link elements are clicked.
export const stopSpeechExtra = async () => {
  // since synth.cancel only clears the current utterance,
  // set it into set interval in order to clear all utterances until
  // the synth object is no longer speaking.
    var x = 0;
    var interval = window.setInterval(function () {
  
      let synth = window.speechSynthesis;
      if (!synth.speaking && x > 50) {
        synth.cancel();
        console.log('CLEARED')
        clearInterval(interval);
      } else {
        x += 1;
        synth.cancel();
      };
  
    }, 10);
}