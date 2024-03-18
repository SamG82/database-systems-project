import client from "../client";
import { Fab, LinearProgress,  } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import { getWaveBlob } from "webm-to-wav-converter";
import { useState } from 'react'

let mediaRecorder: MediaRecorder
const recordingLimitSeconds = 20

type Props = {
    symptomsSetter: Function,
    suggestionsSetter: Function,
    setLoading: Function
}
function AudioRecorder(props: Props) {
    const [inProgress, setInProgress] = useState<boolean>(false)
    const [progressValue, setProgressValue] = useState<number>(0)
    const [timerId, setTimerId] = useState<number>()

    const startProgressCountdown = () => {
        setProgressValue(0)
        const timer = setInterval(() => {
            setProgressValue(prev => {
                if (prev === 100) {
                    return 0
                }
                const newTime = prev + (100 / recordingLimitSeconds)
                return Math.min(newTime, 100)
            })
        }, 1000)

        setTimerId(timer)
    }

    const startRecording = async () => {
        setInProgress(true)
        startProgressCountdown()

        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
        mediaRecorder = new MediaRecorder(stream)

        const data: Array<Blob> = [];

        mediaRecorder.ondataavailable = e => {
            data.push(e.data)
        }

        mediaRecorder.onstop = async () => {
            props.setLoading(true)
            const wavBlob = await getWaveBlob(data[0], false)

            const fd = new FormData()
            fd.append('audio', wavBlob, 'audio.wav')

            const response = await client.post('/appointment/suggestions-audio', fd, { withCredentials: true})

            props.symptomsSetter(response.data.text)
            props.suggestionsSetter(response.data.text)
            props.setLoading(false)
            
        }

        mediaRecorder.start()
    }
    const stopRecording = () => {
        setInProgress(false)
        clearInterval(timerId)
        mediaRecorder.stop()        
    }
    
    return (
        <div className="audio-recorder">
            
            <Fab sx={{marginBottom: '0.5rem'}} color={inProgress ? 'success' : 'primary'} onClick={inProgress ? stopRecording : startRecording}>
                <MicIcon/>
            </Fab>
            {inProgress && 
            <LinearProgress 
            color='success'
            variant='determinate'
            value={progressValue}
            sx={{
                '& .MuiLinearProgress-bar': {
                    height: '20px',
                }
            }}/>
            }
        
        </div>
    )
}

export default AudioRecorder