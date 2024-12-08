'use client'
import db from "../config";
import { Button, Container,  Stack, TextInput, Title, AspectRatio, SimpleGrid, Accordion, CopyButton, Card, Group, ActionIcon, NativeSelect, Combobox, useCombobox, Timeline, Text, Center, Stepper, Alert, List } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { collection, doc, setDoc, addDoc, onSnapshot, getDoc, updateDoc, getDocs } from "firebase/firestore"
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { IconCheck, IconGitCommit,  IconInfoCircle,  IconMicrophoneOff, IconNumber1Small, IconVideoOff } from "@tabler/icons-react"
import SessionOptionComponent  from "./components/sessionOptions"

export default function Home() {

  const localStream = useRef<MediaStream | null>()
  const remoteStream = useRef<MediaStream | null>()
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const gestureDetectorRef = useRef<GestureRecognizer | null>()
  const gestureRef= useRef("")
  const activePipsRef = useRef(0)

  const peerConfigurationRef = useRef(null)

  const [callInput, setCallInput] = useState("")
  const [isCalling, setIsCalling] = useState(false)
  const [isOnCall, setIsOnCall] = useState(false)
  const [animId, setAnimId] = useState(0)

  useEffect(() => {
    // TODO:
    initializegestureDetector()
  }, [])

  /*
  +-----------------------------+
  |                             |
  | WebRTC Peer Connection Code |
  |                             |
  +-----------------------------+
  */

  const fetchIceServerCredentials = async() => {
    let res = await fetch("https://gogura.metered.live/api/v1/turn/credential?secretKey=vbb_Y209ZQzmw-K5YkhWwoXtD_ecBfeOIruZTyakVkuhd-nV", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "expiryInSeconds": 3600,
      }),
    })
    const json = await res.json()
    console.log(json)
    const response = await fetch(`https://gogura.metered.live/api/v1/turn/credentials?apiKey=${json.apiKey}`);
    const iceServers = await response.json();
    return iceServers
  }

  const initalizeStreams = async () => {
    rtcConnectionRef.current = await createPeerConnection()
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


  const createPeerConnection = async () => {
    const iceServers = await fetchIceServerCredentials()
    console.log(iceServers[0], iceServers[1])
    const pc = new RTCPeerConnection({iceServers: [iceServers[0], iceServers[1]]})
    return pc
  }


  const handleRemoteCaller = (event: RTCTrackEvent) => {
    console.log(event)
    event.streams[0].getTracks().forEach(track => {
      remoteStream.current?.addTrack(track)
    })
  }

  /**
   * Initiate the call
   */
  const handleCall = async () => {
    if (rtcConnectionRef.current === null) {
      await initalizeStreams()
    }

    setIsCalling(true)
    setIsOnCall(true)
    
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

          console.log('ICE:',rtcConnectionRef.current)
        }
      })
    })
  }

  /** 
   * Join existing call
   */
  const handleJoin = async () => {
    if (rtcConnectionRef.current === null) {
      await initalizeStreams()
    }

    setIsOnCall(true)

    const callDoc = doc(db, 'calls', callInput)
    const answerCandidate = collection(callDoc, "answerCandidates")
    const offerCandidate = collection(callDoc, "offerCandidates")

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

      onSnapshot(offerCandidate, (doc) => {
          doc.docChanges().forEach((changes) => {
            console.log(changes);
            if (changes.type === 'added') {
              let candidate = new RTCIceCandidate(changes.doc.data());
              rtcConnectionRef.current?.addIceCandidate(candidate);
            }
          });
        });

    } 
    else {
      // callData.data() will be undefined in this case
      console.log("No such document!");
    }
    console.log(callDoc)
  }

  const handleHangUp = async () => {
    localStream.current?.getTracks().forEach((track) => {
      if (track.kind === "video") {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
      }
      if (track.kind === "audio") {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false;
      }
    });
    localVideo.current!.srcObject = null
    remoteVideo.current!.srcObject = null
    rtcConnectionRef.current = null
    setIsCalling(false)
    setIsOnCall(false)
    setCallInput("")
    window.cancelAnimationFrame(animId)
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
          updateGesture(results.gestures[0][0].categoryName)
        }
      }
      const id = window.requestAnimationFrame(loop)
      setAnimId(id)
    }
    loop()
  }

  const updateGesture = (newGesture: string) => {
    if (gestureRef.current !== newGesture) {
      if (newGesture === "None") {
        return
      }
      if (gestureRef.current === "Closed_Fist" && newGesture === "Pointing_Up") {
        activePipsRef.current += 1
      }

      if (gestureRef.current === "Closed_Fist" && newGesture === "Thumb_Down") {
        if (activePipsRef.current > 0) {
         activePipsRef.current -= 1 
        }
      }
      gestureRef.current = newGesture
      console.log(gestureRef.current, activePipsRef.current)
    }

  }

  const getAllInstructions = async(recipeId:string) => {
    try {
      // Reference the 'instructions' subcollection dynamically
      const instructionsCollectionRef = collection(db, "recipes", recipeId, "instructions");
  
      // Fetch all documents in the subcollection
      const instructionsDocs = await getDocs(instructionsCollectionRef);
  
      // Extract and merge the 'values' arrays from each document
      const instructions: any[] = [];
      instructionsDocs.forEach(doc => {
        const data = doc.data();
        if (data.values) {
          instructions.push(...data.values); // Add all items from the 'values' array
        }
      });
  
      return instructions;
    } catch (error) {
      console.error("Error fetching instructions:", error);
      return [];
    }
  }

  return (
    <Container size="xs">
      {!isOnCall 
        ? (
          <>
            <Container size="xs" pb="lg" >
              <Stack>
                <Stack>
                  <Title order={3}>Create Call</Title>
                  <Button onClick={handleCall} disabled={isCalling}>Call</Button>
                </Stack>
                <Stack>
                  <Title order={3}>Join Room</Title>
                  <TextInput value={callInput} onChange={(e) => setCallInput(e.currentTarget.value)}></TextInput>
                  <Button onClick={handleJoin} disabled={isCalling}>Join</Button>
                </Stack>
              </Stack>
            </Container>
            <SessionOptionComponent/>
          </>
        )
        :
        <>
          <Group pb="md" pt="md">
            <CopyButton value={callInput}>
              {({ copied, copy }) => (
                <Button color={copied ? 'teal' : 'blue'} onClick={copy} disabled={callInput === ""}>
                  {copied ? 'Copied code' : 'Copy code'}
                </Button>
              )}
            </CopyButton>
            <ActionIcon size="lg" variant="filled" aria-label="VideoOff">
              <IconVideoOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>

            <ActionIcon size="lg" variant="filled" aria-label="VideoOff">
              <IconMicrophoneOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>

            <Button color="red" onClick={handleHangUp}>Hang Up</Button>
          </Group>
        </>

      }

      {/* NOTE: cannot put this inside the ternary bc of the refs */}
      <SimpleGrid cols={2}>
        <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
          <video  ref={localVideo} autoPlay muted playsInline/>
        </AspectRatio>
        <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
          <video  ref={remoteVideo} autoPlay playsInline/>
        </AspectRatio>
      </SimpleGrid>



      { isOnCall && (
        <>
          <Center>
            <Stepper size="sm" active={activePipsRef.current} orientation="vertical"  styles={{
              root: {display: 'flex', flexDirection: 'row', width: '100%'},
              step: { flexDirection: 'row', alignItems: 'center' },
              content: { diplay: 'flex', alignItems: 'center' , marginLeft:"15px", textAlign:'left'},
            }}>
              <Stepper.Step>
                Heat a skillet over medium heat.
              </Stepper.Step>
              <Stepper.Step>
                Butter one side of each slice of bread.
              </Stepper.Step>
              <Stepper.Step>
                Place one slice, buttered side down, on the skillet and add the cheese.
              </Stepper.Step>
              <Stepper.Step>
                Place the second slice of bread on top, buttered side up.
              </Stepper.Step>
              <Stepper.Step>
                Cook for 2–4 minutes per side until the bread is golden brown and the cheese is melted.
              </Stepper.Step>
              <Stepper.Step>
                Slice and serve hot.
              </Stepper.Step>
              <Stepper.Completed>
                Yay done
              </Stepper.Completed>
            </Stepper>
          </Center>

      <Alert variant="light" color="orange" title="Gesture Controls" icon={<IconInfoCircle/>}>
        <List>
          <List.Item>Next Instruction:✊☝️</List.Item>
          <List.Item>Previous Instruction:✊👎</List.Item>
        </List>
      </Alert>
        </>
      ) }


    </Container>
  );
}
