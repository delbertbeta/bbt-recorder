var playButton = document.getElementById('playButton');
var playIcon = document.getElementById('playIcon');
var pauseIcon = document.getElementById('pauseIcon');
var audioPlayer = document.getElementById('audioPlayer');

var state = "pause";

playButton.addEventListener('click', function () {
  switchPlayVision();
})

window.addEventListener('load', function () {
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

var get = function get(url, data, successHandle, errorHandle) {
  var xmlhttp = new XMLHttpRequest()
  if (xmlhttp != null) {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) { // 4 = "loaded"
        if (xmlhttp.status === 200) { // 200 = "OK"
          successHandle(xmlhttp.responseText)
        } else {
          errorHandle(xmlhttp.statusText)
        }
      }
    }
    xmlhttp.open('GET', url + (data !== '' ? '?' : '') + data, true)
    xmlhttp.send(null)
  }
}

function getInfo() {
  function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  var code = GetQueryString('code');
  get('/get_info.php', 'code=' + code, function (res) {
  // get('/record-manage/test/getinfo.json', 'code=' + code, function (res) {
    var result = JSON.parse(res);
    document.getElementById('name').textContent = result.remark;
    audioPlayer.src = result.url;
  }, function () {
    // no error handle!
  })
}
getInfo();