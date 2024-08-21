// ==UserScript==
// @name         Blockbook block time
// @namespace    http://syscoin.org/
// @version      0.0.1
// @description  Add the time lapse in between blocks on blockbook explorer
// @author       DevElCuy
// @match        *://*.syscoin.org/blocks*
// @icon         https://syscoin.org/images/favicon-32x32.png
// @grant        none
// ==/UserScript==
// @license      MIT

// Frank-GER:
// '@license' in header not allowed in Greasemonkey
// added color to blocktime
// bold only for blocktime >150s

function calculateBlockTimeDiff(blockTime1, blockTime2) {
    const differenceInMilliseconds = Math.abs(blockTime2 - blockTime1);
    return differenceInMilliseconds;
}

function formatBlockTimeDiff(timeDiff) {
    const totalSeconds = timeDiff / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

(function() {
    'use strict';
    function OnDocumentReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    OnDocumentReady(function() {
        let prevEl;
        let prevDate;
        let currDate;
        document.querySelectorAll('.data-div .data-table tr').forEach((el, i) => {
            let isNotHeader = el.querySelector(':scope td');
            if (isNotHeader) {
                let tsEl = el.querySelectorAll('td')[2];
                if (tsEl) {
                    currDate = new Date(tsEl.innerText);
                    if (prevDate) {
                        let timeDiff = calculateBlockTimeDiff(currDate, prevDate);
                        let formattedDiff = formatBlockTimeDiff(timeDiff);
                        if ((timeDiff/1000) <= 150) {
                          prevEl.innerHTML += `<br /> <span style="color:#852a2a">${formattedDiff} min.</span>`;
                        } else if ((timeDiff/1000) <= 300) {
                          prevEl.innerHTML += `<br /> <span style="color:#852a2a"><strong>${formattedDiff} min.</strong></span>`;
                        } else {
                          prevEl.innerHTML += `<br /> <span style="color:#f00000"><strong>${formattedDiff} min.</strong></span>`;
                        }
                    }
                }
                prevEl = tsEl;
            }
            prevDate = currDate;
        });
    });
})();
