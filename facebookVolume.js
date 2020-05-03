// ==UserScript==
// @name         FacebookVolume
// @description  A tampermonkey script to manage facebook volume video
// @homepage     https://github.com/Dunkh4n/FacebookVolume
// @namespace    https://www.facebook.com/
// @author       Dunkh4n
// @version      0.2
// @updateURL    https://raw.githubusercontent.com/Dunkh4n/FacebookVolume/dev/facebookVolume.js
// @downloadURL  https://raw.githubusercontent.com/Dunkh4n/FacebookVolume/dev/facebookVolume.js
// @match        https://www.facebook.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  let observer = new MutationObserver(startObserver);
  let obsrvConfig = {
    childList: true,
    attributes: true,
    subtree: true,
    characterData: true,
  };
  let mainContent = document.getElementById('content');
  let videoList = mainContent.getElementsByTagName('video');
  let videoListArr = [];
  const MUTEDDEFAULT = false;
  const VOLUMEDEFAULT = 0.1;
  const VOLUMEDEFAULTBYSESION = false;
  let newVolume = 0;
  const DEBUG = 1;

  function videoHandler(video) {
    if (!video.hasAttribute('data-fbvID')) {
      let videoHashID = hash(video.getAttribute('src'));
      console.log('videoHashID : ', videoHashID);

      video.setAttribute('data-fbvID', videoHashID);
      video.muted = MUTEDDEFAULT;
      video.volume = VOLUMEDEFAULT;
      video.addEventListener('volumechange', volumeChange);
      videoListArr.push(video);
    }

    if (DEBUG) {
      console.log('video found : ', video);
      console.log('videoListArr : ', videoListArr);
      console.log('videoList length : ', videoListArr.length);
      console.log('##########################');
    }
  }

  function volumeChange(event) {
    if (DEBUG) {
      console.log('The volume changed : ', event.target.volume);
    }
    newVolume = event.target.volume;
    Array.from(videoList).forEach((video) => {
      video.volume = newVolume;
    });
  }

  function startObserver(mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((video) => {
        if (DEBUG) {
          // console.log(
          //   'addedNode.querySelectorAll("video") : ',
          //   video.querySelectorAll('video')
          // );
        }
        Array.from(videoList).forEach(videoHandler);
      });
    });
  }

  function hash(s) {
    /* Simple hash function. */
    var a = 1,
      c = 0,
      h,
      o;
    if (s) {
      a = 0;
      /*jshint plusplus:false bitwise:false*/
      for (h = s.length - 1; h >= 0; h--) {
        o = s.charCodeAt(h);
        a = ((a << 6) & 268435455) + o + (o << 14);
        c = a & 266338304;
        a = c !== 0 ? a ^ (c >> 21) : a;
      }
    }
    return String(a);
  }

  observer.observe(mainContent, obsrvConfig);
})();
