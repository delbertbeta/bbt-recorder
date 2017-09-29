var playButton = document.getElementById('playButton');
var playIcon = document.getElementById('playIcon');
var pauseIcon = document.getElementById('pauseIcon');
var audioPlayer = document.getElementById('audioPlayer');

var state = "pause";

playButton.addEventListener('click', function () {
  switchPlayVision();
})

window.addEventListener('load', function () {
  // get info here..
  audioPlayer.src = './test/music.mp3';
  audioPlayer.addEventListener('ended', function () {
    playIcon.classList.add('show');
    pauseIcon.classList.remove('show');
    state = 'pause';
  })
})

var switchPlayVision = function () {
  if (state === 'pause') {
    playIcon.classList.remove('show');
    pauseIcon.classList.add('show');
    state = 'playing';
    if (audioPlayer.paused === true) {
      audioPlayer.play();
    }
  } else {
    playIcon.classList.add('show');
    pauseIcon.classList.remove('show');
    state = 'pause';
    if (audioPlayer.paused === false) {
      audioPlayer.pause();
    }
  }
}