'use strict';
import peristream from 'peristream/browser';

// Random list of frequency
const FREQUENCIES = [
  50,
  100,
  300,
  500,
  700,
  900,
  1200,
  1400,
  1600,
  2000,
  2200,
  2400,
  3000
];
const DURATION = 0.4; // duration of the noise in second

var stream = peristream("https://www.periscope.tv/w/1lPKqNVNlBEGb");

stream.connect().then(function(emitter){
  emitter.on(peristream.HEARTS, function(message){
    let frequency = getFrequency(message.participant_index);
    makeSound({frequency});
  });
});

var getFrequency = function getFrequency(index){
  if (typeof index !== 'number' || index < 0) {
    throw new Error('given index must be positive number');
  }

  return FREQUENCIES[(index - 1) % FREQUENCIES.length];
};

function makeSound({frequency, volume}){
  var volume = volume || 0.01;

  // create web audio api context
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // create Oscillator and gain node
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  // connect oscillator to gain node to speakers
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // set options for the oscillator
  oscillator.type = 'square';
  oscillator.frequency.value = frequency; // value in hertz
  oscillator.detune.value = 100; // value in cents
  oscillator.start(0);

  gainNode.gain.value = volume;

  oscillator.stop(audioCtx.currentTime + DURATION);
}
