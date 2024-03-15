import client from "../client";
import { getWaveBlob } from "webm-to-wav-converter";

let mediaRecorder: MediaRecorder

const sendBlob = (blob: Blob): void => {
    const fd = new FormData()
    console.log(blob)
    fd.append('audio', blob, 'audio.wav')


    client.post('/appointment/suggestions-audio', fd, { withCredentials: true})
}

function AudioRecorder() {
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
        mediaRecorder = new MediaRecorder(stream)

        const data: Array<Blob> = [];

        mediaRecorder.ondataavailable = e => {
            data.push(e.data)
        }

        mediaRecorder.onstop = async () => {
            console.log('stopped')
            const wavBlob = await getWaveBlob(data[0], false)
            sendBlob(wavBlob)
        }

        mediaRecorder.start()
    }
    const stopRecording = () => {
        mediaRecorder.stop()        
    }
    
    return (
        <div className="audio-recorder">
            <button onClick={startRecording}>Start</button>
            <button onClick={stopRecording}>Stop</button>

        </div>
    )
}

export default AudioRecorder