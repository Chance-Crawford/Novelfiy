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
        }, 30);
    });
}