import React, { useState, useEffect, useRef } from "react";
import { Text, View, ScrollView, Button, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import axios, * as others from 'axios';
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
//import { PitchDetector } from 'react-native-pitch-detector';

import { fft, complex } from 'mathjs';

export default function AudioRecorder() {
    const [recording, setRecording] = useState();
    const [sound, setSound] = useState();
    const [uri, setUri] = useState();
    const [soundArray, setArray] = useState();
    const [timeArray, setTimeArray] = useState([]);
    const screenWidth = Dimensions.get("window").width;
    const [fftResults, setFftResults] = useState([]);
    const [ffttimeArray, setFfttimeArray] = useState([]); // Declare ffttimeArray state
    const [magnitudes, setMagnitudes] = useState([]);
    const [minMagnitude, setMinMagnitude] = useState([]);
    const [maxMagnitude, setMaxMagnitude] = useState([]);
    const [indexOfMaxMagnitude, setIdxMaxMag] = useState([]);
    const musicNotes = [
        ["C", 16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.00],
        ["C#", 17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
        ["D", 18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
        ["Eb", 19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
        ["E", 20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02, 5274.04],
        ["F", 21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65],
        ["F#", 23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96, 5919.91],
        ["G", 24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96, 6271.93],
        ["G#", 25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44, 6644.88],
        ["A", 27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00, 7040.00],
        ["Bb", 29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62],
        ["B", 30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13]
    ];

    useEffect(() => {
        playSound();
        //playSound();
        if (uri != null) {
            processAudioDataFromURI(uri);
        }
    }, [uri]);

    useEffect(() => {
        if (soundArray) {
            console.log(soundArray);
            //console.log(soundArray);

            // Calculate the timeArray and store it in the constiable when the component mounts
            calculateTimeArray(soundArray);
        }
    }, [soundArray]);
    useEffect(() => {
        if (timeArray) {
            console.log(timeArray);
            //console.log(timeArray);
        }
    }, [timeArray]);

    async function calculateTimeArray(soundArray) {
        const newTimeArray = new Array(soundArray.length);
        const timeInterval = 44100;
        for (let i = 0; i < newTimeArray.length; i++) {
            newTimeArray[i] = i / timeInterval;
        }
        setTimeArray(newTimeArray);
    };
    async function playSound() {
        if (uri != null) {
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
    async function audioBufferToWavBuffer(audioBuffer) {
        const wavData = await audioBufferToWav(audioBuffer);
        return new Uint8Array(wavData);
    }

    async function audioBufferToWav(audioBuffer) {
        const pcmData = new Float32Array(audioBuffer.getChannelData(0));
        const wavData = new DataView(new ArrayBuffer(pcmData.length * 2));
        for (let i = 0; i < pcmData.length; i++) {
            const sample = Math.max(-1, Math.min(1, pcmData[i]));
            const sampleValue = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            wavData.setInt16(i * 2, sampleValue, true);
        }
        return wavData.buffer;
    }
    async function processAudioDataFromURI(audioURI) {
        try {
            
            // Fetch the audio data from the URI (assuming it's a URL)
            const response = await fetch(audioURI);
            const audioBlob = await response.blob();

            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Extract the raw audio samples from one channel
            const channelData = audioBuffer.getChannelData(0);
            const rawAudioData = new Float32Array(channelData);
            setArray(rawAudioData);

            // Log the raw audio data array
            //console.log('Raw audio data:', rawAudioData);

            // Convert the Float32Array to a regular JavaScript array
            const rawAudioDataArray = Array.from(rawAudioData);

            // Apply the FFT to the JavaScript array
            const fftResults = fft(rawAudioDataArray);

            // fftResults now contains the complex values resulting from the FFT
            //console.log('FFT Results:', fftResults);

            // Calculate the magnitudes of the complex values
            const magnitudes = fftResults.map(complexValue => complexValue.abs());
            setMagnitudes(magnitudes);


            //console.log('Magnitudes:', magnitudes);
            //console.log('Magnitudes length:', magnitudes.length);

            const minMagnitude = Math.min(...magnitudes);
            const maxMagnitude = Math.max(...magnitudes);
            const indexOfMaxMagnitude = magnitudes.indexOf(Math.max(...magnitudes));
            setMinMagnitude(minMagnitude);
            setMaxMagnitude(maxMagnitude);
            setIdxMaxMag(indexOfMaxMagnitude);

            console.log('minMagnitude:', minMagnitude);
            console.log('maxMagnitude:', maxMagnitude);
            //console.log('indexOfMaxMagnitude:', indexOfMaxMagnitude);

            // Set the fftResults state so you can access it in the component
            setFftResults(fftResults);
            /*
            const totalRange = 22050 - (-22050);
            const timeStep = totalRange / (magnitudes.length -1);
            // Create the time array with values from -22050 to 22050
            const ffttimeArray = [];
            for (let i = -0; i < magnitudes.length; i++) {
              ffttimeArray.push(i * timeStep - 22050);
            }
            */

            // Calculate the frequency values corresponding to the magnitudes
            const samplingRate = audioBuffer.sampleRate; // Sample rate of the audio
            const nyquistFrequency = samplingRate / 2; // Nyquist frequency

            const magnitudesLength = magnitudes.length;
            const frequencyStep = nyquistFrequency / (magnitudesLength - 1); // Frequency step
            const ffttimeArray = [];

            for (let i = 0; i < magnitudesLength; i++) {
                const frequency = i * frequencyStep;
                ffttimeArray.push(frequency);
            }

            setFfttimeArray(ffttimeArray); // Set ffttimeArray state
            /*
            console.log("ffttimeArray length:", ffttimeArray.length);
            console.log("ffttimeArray:", ffttimeArray);
            console.log("fftResults length:", fftResults.length);
            */

            const freqMaxMag = ffttimeArray[indexOfMaxMagnitude];
            console.log("freqMaxMag", freqMaxMag);

            // Log the raw audio data array
            //console.log('Raw audio data:', rawAudioData);

            // Play the raw audio data
            const source = audioContext.createBufferSource();
            const newAudioBuffer = audioContext.createBuffer(1, rawAudioData.length, audioBuffer.sampleRate);
            newAudioBuffer.getChannelData(0).set(rawAudioData);
            source.buffer = newAudioBuffer;
            source.connect(audioContext.destination);
            source.start();

            const frequencyRange = 5.0; // Replace with your desired frequency range

            for (let row = 0; row < musicNotes.length; row++) {
                const rowData = musicNotes[row];
                const note = rowData[0];
                const frequencies = rowData.slice(1);

                for (let col = 0; col < frequencies.length; col++) {
                    const frequency = frequencies[col];
                    if (Math.abs(frequency - freqMaxMag) <= frequencyRange) {
                        console.log(`Match found! Frequency ${freqMaxMag} is within ${frequencyRange} units of ${note} (${frequency}) at col ${col}.`);
                    }
                }
            }



        } catch (error) {
            console.error('Error fetching or processing audio data:', error);
            return null;
        }
    }
    useEffect(() => {
        return sound ?
            () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            } :
            undefined;
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
          const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
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
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        setUri(uri);
        console.log('Recording stopped and stored at', uri);
        playSound();
        // Clear the data by resetting state constiables
    }
    //async function startPitch() {
    //await PitchDetector.start();
    //const subscription = PitchDetector.addListener(console.log)
    //};
    //async function startPitch() {
    //await PitchDetector.stop();
    //PitchDetector.removeListener()
    //};

    const clearState = () => {
        setRecording(undefined);
        setSound(null);
        setUri(null);
        setArray([]);
        setTimeArray([]);
        setFftResults([]);
        setFfttimeArray([]);
        setMagnitudes([]);
        setMinMagnitude([]);
        setMaxMagnitude([]);
        setIdxMaxMag([]);
    };

    return (
      /*recording toggle button*/
      <View style = {
          { flex: 1, alignItems: "center", justifyContent: "center" } } >
        <ScrollView style = {
            { width: "100%" } } >
          <View style = {
            { width: "30%", alignSelf: "center", marginBottom: 10 } } >
            <Button title = { recording ? "Stop Recording" : "Record" }
            color = { recording ? "red" : "green" }
            onPress = { recording ? stopRecording : startRecording }
            //onPress={recording ? stopPitch : startPitch}
            /> 
            <Button title = "Clear State"
              color = "blue"
              onPress = { clearState }
              /> 
          </View> 
        </ScrollView> 
      </View>
    );
}