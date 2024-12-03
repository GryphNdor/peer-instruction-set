'use client'
import db from "../config";
import { Button, Container, Group, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { collection, getFirestore, doc, setDoc, addDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore"

export default function Home() {
  const localStream = useRef<MediaStream | null>()
  const remoteStream = useRef<MediaStream | null>()
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);

  const servers = {
    iceServers: [
      {
        urls: [ 'stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302' ] 
      }
    ],
    iceCandidatePoolSize: 10
  }
  const [callInput, setCallInput] = useState("")

  useEffect(() => {
    rtcConnectionRef.current = createPeerConnection()

    if (typeof window !== 'undefined') { 
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then((stream) => {
        localStream.current = stream
        localStream.current.getTracks().forEach((track) => {
          rtcConnectionRef.current!.addTrack(track, localStream.current!)
        })
        localVideo.current!.srcObject = localStream.current 
        remoteStream.current = new MediaStream()
        rtcConnectionRef.current!.ontrack = handleRemoteCaller
        remoteVideo.current!.srcObject = remoteStream.current
      })
    }
  }, [])

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


  const deactivateCamera = async () => {
    localStream.current?.getTracks().forEach((track) => {
        console.log(track)
        track.stop()
      }
    )
    localVideo.current!.srcObject = null
  }

  /**
   * Initiate the call
   */
  const handleCall = async () => {
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

  const handleJoin = async () => {
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
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    console.log(callDoc)
  }


  return (
    <Container size="lg">
      <Group gap="lg" justify="space-evenly">
        <video ref={localVideo} autoPlay muted/>
        <video ref={remoteVideo} autoPlay/>
      </Group>

      <Container size="sm">
        <Stack>
          <Stack>
            <Title order={3}>Turn Camera Off</Title>
            <Button onClick={deactivateCamera}>Deactivate</Button>
          </Stack>
          <Stack>
            <Title order={3}>Create Call</Title>
            <Button onClick={handleCall}>Call</Button>
          </Stack>
          <Stack>
            <Title order={3}>Join Room</Title>
            <TextInput value={callInput} onInput={(e) => setCallInput(e.currentTarget.value)}></TextInput>
            <Button onClick={handleJoin}>Join</Button>
          </Stack>
        </Stack>
      </Container>
    </Container>
  );
}
