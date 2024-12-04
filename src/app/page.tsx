'use client'
import db from "../config";
import { Button, Container,  Stack, TextInput, Title, AspectRatio, SimpleGrid } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { collection, doc, setDoc, addDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore"
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

export default function Home() {

  const servers = {
    iceServers: [
      {
        urls: [ 'stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302' ] 
      }
    ],
    iceCandidatePoolSize: 10
  }

  const localStream = useRef<MediaStream | null>()
  const remoteStream = useRef<MediaStream | null>()
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const gestureDetectorRef = useRef<GestureRecognizer | null>()

  const [callInput, setCallInput] = useState("")
  const [gesture, setGesture] = useState("")
  const [calling, setCalling] = useState(false)
  const [animId, setAnimId] = useState(0)


  useEffect(() => {
    // TODO:
    // initializegestureDetector()
    initalizeStreams()
  }, [])

  /*
  +-----------------------------+
  |                             |
  | WebRTC Peer Connection Code |
  |                             |
  +-----------------------------+
  */

  const initalizeStreams = async () => {
    rtcConnectionRef.current = createPeerConnection()
    if (typeof window !== 'undefined') { 
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      localStream.current.getTracks().forEach((track) => {
        rtcConnectionRef.current!.addTrack(track, localStream.current!)
      })
      localVideo.current!.srcObject = localStream.current 
      remoteStream.current = new MediaStream()
      rtcConnectionRef.current!.ontrack = handleRemoteCaller
      remoteVideo.current!.srcObject = remoteStream.current
      
    }
    localVideo.current!.addEventListener('loadeddata', () => {
        console.log('Video loaded, starting detection');
        predict();
    });
  }


  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(servers)
    return pc
  }


  const handleRemoteCaller = (event: RTCTrackEvent) => {
    console.log(event)
    event.streams[0].getTracks().forEach(track => {
      remoteStream.current?.addTrack(track)
    })
  }


  const hangUp = async () => {
    localStream.current?.getTracks().forEach((track) => {
      if (track.kind === "video") {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
      }
    });
    localVideo.current!.srcObject = null
    rtcConnectionRef.current = null
    setCalling(false)
    window.cancelAnimationFrame(animId)
  }


  /**
   * Initiate the call
   */
  const handleCall = async () => {
    if (rtcConnectionRef.current === null) {
      initalizeStreams()
    }

    setCalling(true)
    
    // initialize firebase collections
    const callDoc = doc(collection(db, 'calls'))
    const offerCandidate = collection(callDoc, 'offerCandidates')
    const answerCandidate = collection(callDoc, 'answerCandidates')

    // join code
    setCallInput(callDoc.id)

    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      event.candidate && addDoc(offerCandidate, event.candidate.toJSON())
    }

    rtcConnectionRef.current!.onicecandidate = handleIceCandidate

    // add local description
    const offerDescription = await rtcConnectionRef.current?.createOffer()
    await rtcConnectionRef.current?.setLocalDescription(offerDescription)

    console.log(rtcConnectionRef.current)

    const offer = {
      sdp: offerDescription?.sdp,
      type: offerDescription?.type
    }

    // add send offer data to firebase
    await setDoc(callDoc, {offer}).then(
        () => {
          console.log(`Written document ${callDoc.id}`)
        }).catch(
      (err) => console.error(`Cannot write doc: ${err}`)
    )

    // update on firebase, add answer to RTC
    onSnapshot(callDoc, (doc) => {
      const data = doc.data()
      if (!rtcConnectionRef.current?.remoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer)
        rtcConnectionRef.current?.setRemoteDescription(answerDescription)
      }
    })

    // update on firebase, create ICE candidate
    onSnapshot(answerCandidate, (doc) => {
      doc.docChanges().forEach((changes) => {
        if (changes.type === "added") {
          const candidate = new RTCIceCandidate(changes.doc.data())
          rtcConnectionRef.current?.addIceCandidate(candidate)
        }
      })
    })
  }

  /** 
   * Join existing call
   */
  const handleJoin = async () => {
    if (rtcConnectionRef.current === null) {
      initalizeStreams()
    }

    const callDoc = doc(db, 'calls', callInput)
    const answerCandidate = collection(callDoc, "answerCandidates")

    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      event.candidate && addDoc(answerCandidate, event.candidate.toJSON())
    }

    rtcConnectionRef.current!.onicecandidate = handleIceCandidate

    const callData = await getDoc(callDoc)
    if (callData.exists()) {
      const { offer } = callData.data()
      await rtcConnectionRef.current?.setRemoteDescription(offer)

      const answerDescription = await rtcConnectionRef.current?.createAnswer()
      await rtcConnectionRef.current!.setLocalDescription(answerDescription)

      console.log(rtcConnectionRef.current)

      const answer = {
        sdp: answerDescription?.sdp,
        type: answerDescription?.type
      }

      await updateDoc(callDoc, {answer}).then(
        () => {
          console.log(`Updated Document ${callDoc.id}`)
        }
      ).catch( (err) => {
        console.error(`Could not update: ${err}`)
      })

    } 
    else {
      // callData.data() will be undefined in this case
      console.log("No such document!");
    }
    console.log(callDoc)
  }

  /*
  +-----------------------------+
  |                             |
  |  MediaPipe Gesture Control  |
  |                             |
  +-----------------------------+
   */

  const initializegestureDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    gestureDetectorRef.current = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO"
    });
  };

  const predict = () => {
    let lastVideoTime = -1
    const loop = () => {
      let nowInMs = Date.now();
      if (localVideo.current?.currentTime !== lastVideoTime) {
        lastVideoTime = localVideo.current!.currentTime;
        let results = gestureDetectorRef.current?.recognizeForVideo(localVideo.current!, nowInMs)
        if (results?.handedness[0] && results?.gestures[0]) {
          console.log(results.handedness[0][0].categoryName)
          setGesture(results.gestures[0][0].categoryName)
        }
      }
      const id = window.requestAnimationFrame(loop)
      setAnimId(id)
    }

    loop()
  }

  return (
    <Container size="lg">
      <SimpleGrid cols={2}>
        <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
          <video width="50%" height={300} ref={localVideo} autoPlay muted playsInline/>
        </AspectRatio>
        <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
          <video width="50%" ref={remoteVideo} autoPlay playsInline/>
        </AspectRatio>
      </SimpleGrid>

      <Container size="xs" >
        <Stack>
          <div>{gesture}</div>
          <Stack>
            <Title order={3}>Create Call</Title>
            <Button onClick={handleCall}>Call</Button>
          </Stack>
          <Stack>
            <Title order={3}>Join Room</Title>
            <TextInput value={callInput} onInput={(e) => setCallInput(e.currentTarget.value)}></TextInput>
            <Button onClick={handleJoin} disabled={calling}>Join</Button>
          </Stack>
          <Stack>
            <Title order={3}>Hang Up</Title>
            <Button onClick={hangUp}>Deactivate</Button>
          </Stack>
        </Stack>
      </Container>
    </Container>
  );
}
