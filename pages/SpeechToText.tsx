import { useWhisper } from '@chengsokdara/use-whisper'
import { FiberManualRecord, Stop } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useState } from 'react';
import axios from 'axios'

const SpeechToText = () => {
  const [showModal, setShowModal] = useState(false);

  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loader, setLoader]= useState(false)

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTranscription("")
  };

  const API_ENDPOINT = "https://api.openai.com/v1/audio/transcriptions";
  
  const handleFormSubmit = async (event: any) => {
    setLoader(true)
    event.preventDefault();

    if(!file) return false

    // Use FormData to send the file to the API
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model",'whisper-1')

    // Set up the API request headers
    const headers = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "multipart/form-data",
    };

    // Make the API request and set the transcription state
    try {
      const response = await axios.post(API_ENDPOINT, formData, { headers });
      setTranscription(response.data.text);
      setLoader(false)
    } catch (error) {
      console.error(error);
      setLoader(false)
    }
  };

    const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY // YOUR_OPEN_AI_TOKEN
  })

  return (
    <>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span>
              <div className='selection-div'>
                <h2 className='modal-hdg'>Select File to Upload</h2>
                <form onSubmit={handleFormSubmit}>
                  <input type="file" accept="audio/*" onChange={handleFileChange} />
                  <button type="submit">Transcribe</button>
                </form>
              </div>
              {loader && <CircularProgress />}
              {/* <div className='divider'>
                  OR
              </div> */}
              <div className='transcription'>
                {transcription}
              </div>
              {/* <div className='recording'>
                <button onClick={() =>startRecording()}>Start recording</button>
              </div> */}
            </div>
            
          </div>
        )}

         <div className='flex items-center justify-center h-screen flex-col bg-black'>
              <h1 className='text-white mb-2px font-bold text-2xl mb-8'>ChatGPT Voice Recognition</h1>
              <button onClick={handleButtonClick} className='text-white mb-2px font-bold text-2xl mb-8'>Click Me to Upload File</button>
             <div className="flex items-center mb-8">
             <button 
                 className='micStart w-12 h-12 mr-2 outline-none cursor-pointer rounded bg-gray-500' 
                 onClick={() =>startRecording()} 
                 style={{ background: recording ? '#e3bfbc' : '#9db0b8' }}>
                     <FiberManualRecord style={{ color: 'red' }}/>
             </button>
             <button 
                 className='micStop w-12 h-12 mr-2 outline-none cursor-pointer rounded bg-gray-500' 
                 onClick={() => stopRecording()}><Stop />
             </button>
             </div>
         {recording && <CircularProgress />}
         <span className='w-6/12 text-center text-white'>{transcript.text}</span>
         </div>
    </>

  )}






export default SpeechToText;