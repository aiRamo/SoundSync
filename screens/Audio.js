import { Audio } from "expo-av"
import fft from 'fft-js';
import { Button, Image, View, ScrollView, Text } from "react-native";
import React, {useState, useEffect} from "react"

const AudioRecorder = () => {
  const [currentNote, setCurrentNote] = useState(""); /*value of note to be displayed*/
  const [isRecording, setIsRecording] = useState(false); /*for demo will record only when selected*/
  const [recorder, setRecorder] = useState(null); /*recorder object*/
  const [maxFftValue, setMaxFftValue] = useState(0);
  const [fftMag, setFftMag] = useState([]);
  const [fftResult, setFftResult] = useState([]);
  const [audioArray, setAudioArray] = useState([]);

  useEffect (() => {      /*request mic permission on first load*/
    (async () => {
      try{
        await Audio.requestPermissionsAsync();
      } catch (error) {
        console.error("Need audio permission:", error);
      }
    })();
  }, []);

  const toggleRecording = () => {   /*starts and stops recording loop*/
    if (isRecording) {
      setIsRecording(false);
      clearTimeout(recordingLoop);
      console.log("max fft value:", maxFftValue);
      console.log("ffit mag:", fftMag);
      console.log("fft result:", fftResult);
      console.log("audio array:", audioArray);
    }
    else {
      setIsRecording(true);
      recordingLoop();
    }
  }

  useEffect(() => {
    console.log("max fft value:", maxFftValue);
  }, [maxFftValue]);

  const recordingLoop = async () => {   
    if(isRecording) {
      try {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
        await recording.startAsync();
        setIsRecording(recording);

        setTimeout(async () => {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          const { sound } = await Audio.Sound.createAsync({ uri });
          const status = await sound.getStatusAsync();
          const audioData = status.isLoaded ? sound._loaded : null;
          const audioArray = audioData ? Array.from(audioData.data) : [];
          const fftResult = fft.fft(audioArray);
          const fftMag = fftUtil.fftMag(fftResult);
          const maxMagnitude = Math.max(...fftMag);
          setMaxFftValue(maxMagnitude);
          

          recordingLoop();
        }, 200);
      }
      catch (error) {
        console.error("rec error", error);
      }
    }
  };

  return (        /*recording toggle button*/
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ScrollView style={{ width: '100%' }}>
        <View style={{ width: '30%', alignSelf: 'center', marginBottom: 10}}>
          <Button title={isRecording ? "Stop Recording" : "Record"} color ={isRecording ? "red" : "green"} onPress={toggleRecording} />
        </View>
      </ScrollView>
    </View>
  );
}

export default AudioRecorder;