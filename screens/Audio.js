import React, { useState, useEffect, useRef } from "react";
import { Text, View, ScrollView, Button, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import axios, * as others from 'axios';
import { VictoryChart, VictoryLine, VictoryAxis} from "victory";
//import { PitchDetector } from 'react-native-pitch-detector';
import { fft } from 'mathjs';

export default function AudioRecorder() {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [uri, setUri] = useState();
  const [array, setArray] = useState();
  const [timeArray, setTimeArray] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const [array, setArray] = useState([]);


  useEffect(() => {
    playSound();
    if(uri!=null) {
      processAudioDataFromURI(uri);
    }
  }, [uri]);

  useEffect(() => {
    if (array) {
      console.log(array);

      // Calculate the timeArray and store it in the variable when the component mounts
      calculateTimeArray(array);
      applyFFT(array);
    }
  }, [array]);

  useEffect(() => {
    if(timeArray)
    {
      console.log(timeArray);
    }
  }, [timeArray]);

  function applyFFT(audioSamples) {
    const fft = new p5.FFT();
    fft.setInput(audioSamples);
    const spectrum = fft.analyze();
    console.log("Spectrum:", spectrum);
    // Use the spectrum data as needed.

    console.log(spectrum);
  }

  async function calculateTimeArray(array) {
    const newTimeArray = new Array(array.length);
    const timeInterval = 44100; 
    for (let i = 0; i < newTimeArray.length; i++) {
      newTimeArray[i] = i / timeInterval;
    }
    setTimeArray(newTimeArray);
  };


  async function playSound() {
    if(uri != null)
    {
      console.log('Loading Sound');
      const { sound, status } = await Audio.Sound.createAsync(uri);
      if (status.isLoaded) {
        setSound(sound);
  
        console.log('Playing Sound');
        await sound.playAsync();
      } else {
        console.error('Sound is not loaded.');
      }
    }
  }

  async function processAudioDataFromURI(audioURI) {
    try {
      // Fetch the audio data from the URI (assuming it's a URL)
      const response = await axios.get(audioURI, { responseType: 'arraybuffer' });
      const audioData = new Uint8Array(response.data);
  
      // Convert the audio data to an array of numbers (assuming it's 8-bit unsigned data)
      const audioSamples = Array.from(audioData).map((sample) => sample - 128);
      setArray(audioSamples);
      const fftResults = fft(audioSamples); 
      console.log('FFT Results:', fftResults);
      //const magnitudes = fftResults.map(([real, imag]) => Math.sqrt(real ** 2 + imag ** 2));
      //console.log('Magnitudes:', magnitudes);
  
      // Perform the FFT on the audio samples
      // const phasors = fft.fft(audioSamples);
  
      // Process the FFT output as needed
      // For example, you might calculate the magnitudes of the frequency components:
      // const magnitudes = phasors.map((phasor) => Math.sqrt(phasor.real  2 + phasor.imag  2));

    } catch (error) {
      console.error('Error fetching or processing audio data:', error);
      return null;
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    setUri(uri);
    console.log('Recording stopped and stored at', uri);
    playSound();
  }

  //async function startPitch() {
    //await PitchDetector.start();
    //const subscription = PitchDetector.addListener(console.log)
  //};

  //async function startPitch() {
    //await PitchDetector.stop();
    //PitchDetector.removeListener()
  //};

  return (
    /*recording toggle button*/
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ScrollView style={{ width: "100%" }}>
        <View style={{ width: "30%", alignSelf: "center", marginBottom: 10 }}>
          <Button
            title={recording ? "Stop Recording" : "Record"}
            color={recording ? "red" : "green"}
            onPress={recording ? stopRecording : startRecording}
            //onPress={recording ? stopPitch : startPitch}
          />
        </View>
        {timeArray.length > 0 && array.length > 0 && (
          <VictoryChart
          width={250}
          height={250}
          domain={{ x: [0, 0.25], y: [-200, 200] }}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31", strokeWidth: 0.25 },
            }}
            data={timeArray.map((xValue, index) => ({ x: xValue, y: array[index] }))}
          />
          <VictoryAxis
            style={{
              axis: {stroke: "#756f6a"},
              axisLabel: {fontSize: 2},
              tickLabels: {fontSize: 2, padding: -5, offset: -10}
            }}
          />
          <VictoryAxis
            dependentAxis // This makes it the Y-axis
            style={{
              axis: { stroke: "#756f6a" },
              axisLabel: { fontSize: 2 }, // Adjust the font size as needed
              tickLabels: { fontSize: 2, padding: -5, offset: -10 }, // Adjust the font size as needed
            }}
          />
        </VictoryChart>
        )}
      </ScrollView>
    </View>
    );
}