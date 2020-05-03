// ==UserScript==
// @name         FacebookVolume
// @description  A tampermonkey script to manage facebook volume video
// @homepage     https://github.com/Dunkh4n/FacebookVolume
// @namespace    https://www.facebook.com/
// @author       Dunkh4n
// @version      0.3
// @updateURL    https://raw.githubusercontent.com/Dunkh4n/FacebookVolume/master/facebookVolume.js
// @downloadURL  https://raw.githubusercontent.com/Dunkh4n/FacebookVolume/master/facebookVolume.js
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
  const DEBUG = 0;

  // Handle each video
  function videoHandler(video) {
    // Make sure we tag each new video and not older one we have already tagged
    if (!video.hasAttribute('data-fbvID')) {
      let videoHashID = hash(video.getAttribute('src'));
      video.setAttribute('data-fbvID', videoHashID);
      video.muted = MUTEDDEFAULT;
      video.volume = VOLUMEDEFAULT;
      video.addEventListener('volumechange', volumeChange);

      // Push each video in an array, for now it's serve nothing
      videoListArr.push(video);
    }

    if (DEBUG) {
      console.log('video found : ', video);
      console.log('videoHashID : ', videoHashID);
      console.log('videoListArr : ', videoListArr);
      console.log('videoList length : ', videoListArr.length);
      console.log('##########################');
    }
  }

  // If change on the volume on one video, change the volume for all videos
  function volumeChange(event) {
    if (DEBUG) {
      console.log('The volume changed : ', event.target.volume);
    }
    newVolume = event.target.volume;
    Array.from(videoList).forEach((video) => {
      video.volume = newVolume;
    });
  }

  // Start the mutation observer
  // Serve as an event(loop) everytime a new node is added to the page
  function startObserver(mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((video) => {
        Array.from(videoList).forEach(videoHandler);
      });
    });
  }

  // Id each video with a hash by it's src url
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
