/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * Creates a video element for a new participant
 *
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 * @return
 */
function Participant(name) {
  this.name = name;
  var video = document.createElement('video');
  var rtcPeer;

  video.onclick = toggleVideoMuted;
  document.getElementById('participants').appendChild(video);

  video.id = 'video-' + name;
  video.autoplay = true;
  video.controls = false;


  this.getElement = function() {
    return video;
  }

  this.getVideoElement = function() {
    return video;
  }

  function toggleVideoMuted() {
    video.muted = !video.muted
  }

  this.offerToReceiveVideo = function(error, offerSdp, wp){
    if (error) return console.error ("sdp offer error")
    console.log('Invoking SDP offer callback function');
    var msg =  {
      id : "receiveVideoFrom",
      sender : name,
      sdpOffer : offerSdp
    };
    sendMessage(msg);
  }


  this.onIceCandidate = function (candidate, wp) {
    console.log("Local candidate" + candidate);

    var message = {
      id: 'onIceCandidate',
      candidate: candidate,
      sender: name
    };
    sendMessage(message);
  }

  Object.defineProperty(this, 'rtcPeer', { writable: true});

  this.dispose = function() {
    console.log('Disposing participant ' + this.name);
    this.rtcPeer.dispose();
    video.parentNode.removeChild(video);
  };
}
