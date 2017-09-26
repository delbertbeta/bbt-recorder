var timerStart = function(timespan) {
    if (timespan != 0) {
        return setImmediate(function(timespan) {
            timespan += 1;
        }, 1000)
    }
    else {
        timespan = 0;
        return timerStart(timespan);
    }
}

var timerStop = function(requsetId) {
    return clearImmediate(requsetId);
}

module.exports = {
    timerStart: timerStart,
    timerStop: timerStop
}