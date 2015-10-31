'use strict';
import peristream from 'peristream/browser';

// Random list of 13 frequencies, the logic behind this number this that there
// is different hearts colors on Periscope, so let's make 13 different sounds
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
const button = document.getElementById("submit"),
  url = document.getElementById('input');

var stream;

button.addEventListener('click', function() {
  if (typeof url.value !== 'string') {
    throw new Error('given url is undefined')
  }

  disconnect();
  connect(url.value);
});

function disconnect(url) {
  if (stream) {
    stream.disconnect();
  }
}

function connect(url) {
  stream = peristream(url);

  stream.connect().then(function(emitter) {
    emitter.on(peristream.HEARTS, function(message) {
      let frequency = getFrequency(message.participant_index);
      playSound({frequency});
    });
  });
}

function getFrequency(index) {
  if (typeof index !== 'number' || index < 0) {
    throw new Error('given index must be positive number');
  }

  return FREQUENCIES[(index - 1) % FREQUENCIES.length];
}

function playSound({frequency, volume}) {
  var volume = volume || 0.01;

  // create web audio api context
  try {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {
    alert('Web Audio API is not supported in this browser');
  }

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

  // set option for the gain
  gainNode.gain.value = volume;

  oscillator.stop(audioCtx.currentTime + DURATION); // stop the sound after DURATION seconds
}
