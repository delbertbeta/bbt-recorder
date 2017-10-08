// Vue

var app = new Vue({
    el: '#app',
    data: {
        records: [],
        pages: 0,
        selectedRecord: [],
        checkedIds: [],
    },
    watch: {
        checkedIds: function () {
            console.log(this.checkedIds);
        },
        pages: function () {
            setTimeout(function () {
                var lis = $('#pagination').children();
                var first = lis[1];
                first.className = 'active light-blue';
                if (lis.length == 3) {
                    last = lis[2];
                    last.className = 'disabled';
                }
            }, 50);
        },
        records: function () {
            app.pages = Math.ceil(app.records.length / 10);
            navigationManager(pageNow);
        },
    },
    methods: {
        nextPage: function () {
            navigationManager(pageNow + 1);
        },
        forwardPage: function () {
            navigationManager(pageNow - 1);
        },
        changePage: function (page) {
            navigationManager(page);
        },
        playRecord: function (event, id) {
            playRecord(event, id);
        },
        stopPlayRecord: function (event, id) {
            stopPlayRecord(event, id);
        },
        deleteRecord: function (id) {
            deleteRecord(id);
        },
        selectAll: function () {
            selectAll();
        },
        exportQrCode: function () {
            if (this.checkedIds.length === 0) {
                Materialize.toast('请选中一个录音后再导出', 4000);
                return;
            }
            get('/get_qrcode.php', this.checkedIds, true, function (blob) {
                var saveData = (function () {
                    var a = document.createElement('a')
                    document.body.appendChild(a)
                    a.style = 'display: none'
                    return function (data, fileName) {
                        var blob = new Blob([data], {
                            type: 'octet/stream'
                        })
                        var url = window.URL.createObjectURL(blob)
                        a.href = url
                        a.download = fileName
                        a.click()
                        window.URL.revokeObjectURL(url)
                    }
                }())
                var date = new Date();
                var fileName = 'bbt_record_qrcode_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + date.getHours() + '_' + date.getMinutes() + '_' + date.getSeconds() + '.zip';
                saveData(blob, fileName);
            }, function (err) {
                Materialize.toast('网络错误', 4000);
            }, true)
        }
    }
})

// Polyfill

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// Record player

var audioPlayer = document.getElementById('audioPlayer');
var lastPlayDOM;

audioPlayer.addEventListener('ended', function () {
    lastPlayDOM.parentElement.classList.remove('stop');
    lastPlayDOM.parentElement.classList.add('play');
})

var playRecord = function (event, id) {
    if (!audioPlayer.paused) {
        stopPlayRecord();
    }
    lastPlayDOM = event.target;
    lastPlayDOM.parentElement.classList.remove('play');
    lastPlayDOM.parentElement.classList.add('stop');
    audioPlayer.src = app.records[id].url;
    audioPlayer.play();
}

var stopPlayRecord = function (event, id) {
    audioPlayer.pause();
    lastPlayDOM.parentElement.classList.remove('stop');
    lastPlayDOM.parentElement.classList.add('play');
}

var getRecords = function () {
    $.ajax({
        method: 'GET',
        dataType: 'json',
        // url: 'https://withcic.cn/apps/upload/index.php?show',
        // url: 'http://192.168.1.106/record/index.php?show',
        url: '/get_record.php',
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success: function (data) {
            if (data.status == 1) {
                var records = [];
                for (var i = 0; i < data.respond.length; i++) {
                    var aRecord = data.respond[i];
                    aRecord.regtime = moment.unix(aRecord.regtime).format('YYYY年MM月DD日 HH:MM:SS');
                    aRecord.displayId = i;
                    aRecord.url = aRecord.url.replace('silk', 'mp3');
                    records.push(aRecord);
                }
                app.records = records;
            } else {
                Materialize.toast(data.message, 4000);
            }
        },
        error: function (error) {
            Materialize.toast(error.responseText, 4000);
        }
    })
}

var deleteRecord = function (id) {
    $.ajax({
        method: 'POST',
        url: '/delete_record.php',
        // url: 'http://192.168.1.106/record/index.php?delete=1',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        data: 'id=' + app.records[id].id,
        dataType: 'json',
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        success: function (data) {
            if (data.status == 0) {
                Materialize.toast('删除成功', 4000);
                app.records.splice(id, 1);
            } else {
                Materialize.toast(data.message, 4000);
            }
        },
        error: function (error) {
            Materialize.toast(error.responseText, 4000);
        }
    })
}

// Page & Navigation manager

var pageNow = 1;

var changePage = function (page) {
    app.selectedRecord = [];
    if (page == 1) {
        for (let i = 0; i < 40 && i < app.records.length; i++) {
            app.selectedRecord.push(app.records[i]);
        }
    } else {
        var startPoint = (page - 1) * 40;
        for (let i = startPoint;
            (i < (startPoint + 40)) && (i < app.records.length); i++) {
            app.selectedRecord.push(app.records[i]);
        }
    }
}


var navigationManager = function navigationManager(page) {
    setTimeout(function () {
        var lis = $('#pagination').children();
        if (page > app.pages) {
            page = app.pages;
        }
        if (page == 0) {
            return;
        }
        if (page == 1) {
            if (lis.length == 3) {} else {
                lis[app.pages + 1].className = 'waves-effect pointer';
                lis[0].className = 'disabled pointer'
            }
        } else if (page == app.pages) {
            if (lis.length == 3) {} else {
                lis[0].className = 'waves-effect pointer';
                lis[app.pages + 1].className = 'disabled pointer';
            }
        } else {
            if (lis.length == 3) {} else {
                lis[0].className = 'waves-effect pointer';
                lis[app.pages + 1].className = 'waves-effect pointer';
            }
        }
        lis[pageNow].className = 'wave-effect pointer';

        lis[page].className = 'active light-blue pointer';
        pageNow = page;
        changePage(page);

    }, 50);
}

getRecords();

// Logout

document.getElementById('logoutButton').addEventListener('click', function () {
    $.ajax({
        method: 'GET',
        url: '/logout.php',
        // url: 'http://192.168.1.106/record/index.php?logout',
        // xhrFields: {
        //     withCredentials: true
        // },
        // crossDomain: true,
        dataType: 'json',
        success: function (result) {
            if (result.status == 1) {
                window.location.href = "./index.html"
            } else {
                Materialize.toast(result.message, 4000);
            }
        },
        error: (error) => {
            Materialize.toast(error.responseText, 4000);
        }
    })
})

var selectAll = function () {
    document.getElementsByName('check').forEach(function (dom, index) {
        if (dom.checked === false) {
            dom.click();
        }
    })
}

var dataChecker = function (data, json) {
    var type = typeof (data)
    switch (type) {
      case 'string':
        return data
      case 'object':
        if (json) {
          return JSON.stringify(data)
        } else {
          var counter = 0
          var targetString = ''
          for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
              var propFilter = prop.replace(/&/g, '')
              var dataFilter = data[prop].toString().replace(/&/g, '')
              if (counter === 0) {
                targetString = targetString + propFilter + '=' + dataFilter
              } else {
                targetString = targetString + '&' + propFilter + '=' + dataFilter
              }
              counter++
            }
          }
          return targetString
        }
      default:
        return data
    }
  }

var post = function post(url, data, json, successHandle, errorHandle, blob) {
    var xmlhttp = new XMLHttpRequest()
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) { // 4 = "loaded"
                if (xmlhttp.status === 200) { // 200 = "OK"
                    if (blob) {
                        successHandle(xmlhttp.response)
                    } else {
                        successHandle(xmlhttp.responseText)
                    }
                } else {
                    if (blob) {
                        errorHandle(xmlhttp.response)
                    } else {
                        errorHandle(xmlhttp.statusText)
                    }
                }
            }
        }
        var targetData = dataChecker(data, json)
        xmlhttp.open('POST', url, true)
        if (json) {
            xmlhttp.setRequestHeader('Content-Type', 'application/json')
        } else {
            xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        }
        if (blob) {
            xmlhttp.responseType = 'blob'
        }
        xmlhttp.send(targetData)
    }
}

const get = function get (url, data, json, successHandle, errorHandle, blob) {
    var xmlhttp = new XMLHttpRequest()
    if (xmlhttp != null) {
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) { // 4 = "loaded"
          if (xmlhttp.status === 200) { // 200 = "OK"
            if (blob) {
              successHandle(xmlhttp.response)
            } else {
              successHandle(xmlhttp.responseText)
            }
          } else {
            if (blob) {
              errorHandle(xmlhttp.response)
            } else {
              errorHandle(xmlhttp.statusText)
            }
          }
        }
      }
      var targetData = dataChecker(data, json)
      if (json) {
        targetData = 'json=' + targetData
      }
      xmlhttp.open('GET', url + (targetData !== '' ? '?' : '') + targetData, true)
      if (blob) {
        xmlhttp.responseType = 'blob'
      }
      xmlhttp.send(null)
    }
  }
