const socket=io('/');
let myVideoStream;
const videoGrid = document.getElementById('vedio-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
  })

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })    

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
      })
    })

    myPeer.on('open', id => {
        socket.emit('join-room', ROOM_ID, id)
      })

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
  } 


    const addVideoStream=(video, stream)=> {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        videoGrid.append(video)
      }