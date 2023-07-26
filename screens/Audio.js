import { Audio } from "expo-av"
import { Button, Image, View, ScrollView, Text } from "react-native";
import React, {useState, useEffect} from "react"

const AudioRecorder = () => {
  const [currentNote, setCurrentNote] = useState(""); /*value of note to be displayed*/
  const [isRecording, setIsRecording] = useState(false); /*for demo will record only when selected*/
  const [recorder, setRecorder] = useState(null); /*recorder object*/

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
    }
    else {
      setIsRecording(true);
      recordingLoop();
    }
  }

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