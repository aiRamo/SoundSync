#include <map>
#include <string>
#include <iostream>
#include <vector>
#include <cmath>
#include <fftw3.h>
#include <portaudio.h>
#include <libwebsockets.h>

const int SAMPLE_RATE = 48000;
const double CHUNK_DURATION = 0.2; // 0.5 seconds
const int CHUNK_SIZE = SAMPLE_RATE * CHUNK_DURATION;
const int FRAMES_PER_BUFFER = 256;
static struct lws *wsi_global = NULL;
char str[55];

std::vector<double> recordingBuffer(CHUNK_SIZE, 0.0);
int bufferIndex = 0;

struct lws_context *context;
struct lws_context_creation_info info;
const char *address = "0.0.0.0";
int port = 9000;

int noteFreq[46] = 
{
    0,
    82,
    87,
    92,
    98,
    104,
    110,
    117,
    123, 
    131, 
    139, 
    147, 
    156, 
    165, 
    175,
    185,
    196,
    208,
    220,
    233,
    247,
    262,
    277,
    294,
    311,
    329,
    349,
    370,
    392,
    415,
    440,
    466,
    494,
    523,
    554,
    587, 
    622,
    659,
    698,
    740,
    784,
    831,
    880,
    932,
    988,
    1047
};

char* noteName[46] = 
{
    NULL,
    "E1",
    "F1",
    "F1#",
    "G1",
    "G1#", 
    "A1",
    "A1#", 
    "B1",
    "C1",
    "C1#", 
    "D1",
    "D1#",  
    "E2",
    "F2",
    "F2#", 
    "G2",
    "G2#", 
    "A2",
    "A2#", 
    "B2",
    "C2",
    "C2#", 
    "D2",
    "D2#", 
    "E3",
    "F3",
    "F3#",
    "G3",
    "G3#",
    "A3",
    "A3#", 
    "B3",
    "C3",
    "C3#", 
    "D3",
    "D3#",
    "E4",
    "F4",
    "F4#", 
    "G4",
    "G4#", 
    "A4",
    "A4#", 
    "B4",
    "C4",
};

std::map<std::pair<double, double>, std::string> freq_to_note = {
    // Octave 1
    {{32.70, 34.65}, "C1"},
    {{34.65, 36.71}, "C#1/Db1"},
    {{36.71, 38.89}, "D1"},
    {{38.89, 41.20}, "D#1/Eb1"},
    {{41.20, 43.65}, "E1"},
    {{43.65, 46.25}, "F1"},
    {{46.25, 49.00}, "F#1/Gb1"},
    {{49.00, 51.91}, "G1"},
    {{51.91, 55.00}, "G#1/Ab1"},
    {{55.00, 58.27}, "A1"},
    {{58.27, 61.74}, "A#1/Bb1"},
    {{61.74, 63.41}, "B1"},
    // Octave 2
    {{63.41, 69.30}, "C2"},
    {{69.30, 73.42}, "C#2/Db2"},
    {{73.42, 77.78}, "D2"},
    {{77.78, 78}, "D#2/Eb2"},
    {{79, 84}, "E STRING"},
    {{87.31, 92.50}, "F2"},
    {{92.50, 98.00}, "F#2/Gb2"},
    {{98.00, 103.83}, "G2"},
    {{103.83, 110.00}, "G#2/Ab2"},
    {{108.00, 112}, "A STRING"},
    {{116.54, 123.47}, "A#2/Bb2"},
    {{123.47, 128.81}, "B2"},
    // Octave 3
    {{128.81, 138.59}, "C3"},
    {{138.59, 146.83}, "C#3/Db3"},
    {{144.83, 148.56}, "D3"},
    {{155.56, 164.81}, "D#3/Eb3"},
    {{164.81, 174.61}, "E3"},
    {{174.61, 185.00}, "F3"},
    {{185.00, 196.00}, "F#3/Gb3"},
    {{194.00, 198.65}, "G STRING"},
    {{207.65, 220.00}, "G#3/Ab3"},
    {{220.00, 233.08}, "A3"},
    {{233.08, 246.94}, "A#3/Bb3"},
    {{244.94, 248.63}, "B STRING"},
    // Octave 4
    {{259.63, 277.18}, "C4"},
    {{277.18, 293.66}, "C#4/Db4"},
    {{293.66, 311.13}, "D4"},
    {{311.13, 327.63}, "D#4/Eb4"},
    {{327.63, 331.23}, "E STRING"},
    {{347.23, 369.99}, "F4"},
    {{369.99, 390.00}, "F#4/Gb4"},
    {{390.00, 415.30}, "G4"},
    {{415.30, 438.00}, "G#4/Ab4"},
    {{438.00, 466.16}, "A4"},
    {{466.16, 493.88}, "A#4/Bb4"},
    {{493.88, 521.25}, "B4"},

    // Octave 5
    {{521.25, 554.37}, "C5"},
    {{554.37, 587.33}, "C#5/Db5"},
    {{587.33, 622.25}, "D5"},
    {{622.25, 659.26}, "D#5/Eb5"},
    {{659.26, 698.46}, "E5"},
    {{698.46, 739.99}, "F5"},
    {{739.99, 783.99}, "F#5/Gb5"},
    {{783.99, 830.61}, "G5"},
    {{830.61, 880.00}, "G#5/Ab5"},
    {{880.00, 932.33}, "A5"},
    {{932.33, 987.77}, "A#5/Bb5"},
    {{987.77, 1044.50}, "B5"},

    // Octave 6
    {{1044.50, 1108.73}, "C6"},
    {{1108.73, 1174.66}, "C#6/Db6"},
    {{1174.66, 1244.51}, "D6"},
    {{1244.51, 1318.51}, "D#6/Eb6"},
    {{1318.51, 1396.91}, "E6"},
    {{1396.91, 1479.98}, "F6"},
    {{1479.98, 1567.98}, "F#6/Gb6"},
    {{1567.98, 1661.22}, "G6"},
    {{1661.22, 1760.00}, "G#6/Ab6"},
    {{1760.00, 1864.66}, "A6"},
    {{1864.66, 1975.53}, "A#6/Bb6"},
    {{1975.53, 2093.00}, "B6"},
    // Octave 7
    {{2093.00, 2217.46}, "C7"},
    {{2217.46, 2349.32}, "C#7/Db7"},
    {{2349.32, 2489.02}, "D7"},
    {{2489.02, 2637.02}, "D#7/Eb7"},
    {{2637.02, 2793.83}, "E7"},
    {{2793.83, 2959.96}, "F7"},
    {{2959.96, 3135.96}, "F#7/Gb7"},
    {{3135.96, 3322.44}, "G7"},
    {{3322.44, 3520.00}, "G#7/Ab7"},
    {{3520.00, 3729.31}, "A7"},
    {{3729.31, 3951.07}, "A#7/Bb7"},
    {{3951.07, 4186.01}, "B7"}

};

std::string findNote(double frequency)
{
    for (const auto &entry : freq_to_note)
    {
        if (frequency >= entry.first.first && frequency < entry.first.second)
        {
            return entry.second;
        }
    }
    return "Unknown";
}

static int audioCallback(const void *inputBuffer, void *outputBuffer,
                         unsigned long framesPerBuffer,
                         const PaStreamCallbackTimeInfo *timeInfo,
                         PaStreamCallbackFlags statusFlags,
                         void *userData)
{
    float *input = (float *)inputBuffer;

    // Check if input buffer is null, indicating no mic input
    if (inputBuffer == nullptr)
    {
        // If no microphone is found and the WebSocket connection is established
        if (wsi_global)
        {
            const char *noMicMsg = "No mic found";
            // Prepare a message to send - note LWS_PRE is the number of extra bytes libwebsockets expects for protocol framing
            size_t len = strlen(noMicMsg);
            unsigned char *buf = (unsigned char *)malloc(LWS_PRE + len);
            memcpy(buf + LWS_PRE, noMicMsg, len); // Copy the message into the correct position buf+LWS_PRE
            // Write out the message to the WebSocket
            lws_write(wsi_global, buf + LWS_PRE, len, LWS_WRITE_TEXT);
            free(buf); // Clean up the heap memory allocated
        }
        return paContinue; // Return and wait for the next callback
    }

    // Fill recordingBuffer with incoming data
    for (unsigned long i = 0; i < framesPerBuffer; ++i)
    {
        if (bufferIndex >= CHUNK_SIZE)
        {
            // Perform FFT on recordingBuffer here
            fftw_complex *out;
            fftw_plan p;

            out = (fftw_complex *)fftw_malloc(sizeof(fftw_complex) * CHUNK_SIZE);
            p = fftw_plan_dft_r2c_1d(CHUNK_SIZE, recordingBuffer.data(), out, FFTW_ESTIMATE);

            fftw_execute(p);

            // Your FFT processing logic here

            // Print the first complex number for debugging
            // std::cout << "First FFT output: (" << out[0][0] << ", " << out[0][1] << "i)" << std::endl;
            double magnitudes[CHUNK_SIZE/2];

            // Find the frequency with the maximum magnitude
            double max_magnitude = 0.0;
            int max_index = 0;
            for (int i = 0; i < CHUNK_SIZE / 2; ++i)
            {
                double real = out[i][0];
                double imag = out[i][1];
                double magnitude = std::sqrt(real * real + imag * imag);
                magnitudes[i] = magnitude;

                if (magnitude > max_magnitude)
                {
                    max_magnitude = magnitude;
                    max_index = i;
                }
            }
            //Getting the avg of all magnitudes
            double avg;
            for(int i = 0; i < CHUNK_SIZE / 2; i++)
            {
                avg += magnitudes[i];
            }
            avg /= CHUNK_SIZE / 2;

            //Setting all magnitudes other than the local maximums to 0
            for(int i = 0; i < CHUNK_SIZE / 2; i++)
            {
                if (magnitudes[i] < (avg * 30)) 
                {
                    magnitudes[i] = 0;
                }
            }

            int localMaximums[3] = {0,0,0};

            //Putting local maximums in array
            int count = 0;
            for(int i = 1; i < 215; i++)
            {
                if(magnitudes[i-1] < magnitudes[i] && magnitudes[i] > magnitudes[i+1])
                {
                    //setting index of magnitude to localMaximums
                    // localMaximums[count] = i;
                    // count++;
                    // if(count == 3)
                    // {
                    //     break;
                    // }
                    //localMaximums[1] = magnitudes[i];

                    //localMaximums[2] = magnitudes[i+1]; 
            switch (count) {
                case 0:
                    localMaximums[0] = i;
                    count++;
                    break;
                case 1:
                    if (((float)(i % localMaximums[0]) / localMaximums[0] > 0.1) && ((float)(i % localMaximums[0]) / localMaximums[0] < 0.9)) {
                        //printf("%d, %d, %f\n", i, localMaximums[0], (float)(i % localMaximums[0]) / i);
                        localMaximums[1] = i;
                        count++;
                    }
                    break;
                case 2:
                    if (((float)(i % localMaximums[0]) / localMaximums[0] > 0.1) && ((float)(i % localMaximums[0]) / localMaximums[0] < 0.9) &&
                        ((float)(i % localMaximums[1]) / localMaximums[1] > 0.1) && ((float)(i % localMaximums[1]) / localMaximums[1] < 0.9)) {
                        localMaximums[2] = i;
                        break;
                    }
                    break;
            }
                }

            }
        
                

            double dominant_frequency[3];
            for(int i=0;i<3;i++)
            {
                dominant_frequency[i] = static_cast<double>(localMaximums[i]) * (SAMPLE_RATE / static_cast<double>(CHUNK_SIZE));
                //printf("%d: %d\n", i+1,dominant_frequency[i]);
            }

            int dif = 1000;
            int detNoteFreq[3];
            char* detNote[3];
            for(int j=0;j<3;j++)   
            {
                for(int i = 0; i < 45; i++)
                {
                    if(abs(dominant_frequency[j] - noteFreq[i]) < dif)
                    {
                        detNoteFreq[j] = noteFreq[i];
                        dif = abs(dominant_frequency[j] - noteFreq[i]);
                        detNote[j] = noteName[i];
                    }
                }
            }
            

            //std::string note = findNote(dominant_frequency);
            // std::cout << "The frequency " << dominant_frequency << " Hz corresponds to the note " << note << std::endl;

            if (wsi_global)
            {
                int length;
                if(dominant_frequency[0] < 1100 && dominant_frequency[0] > 65)
                {
                    if(dominant_frequency[2] != 0)
                    {
                        length = snprintf(str, sizeof(str), "%.0lfHz, %.0lfHz, %.0lfHz, %s, %s, %s\n", dominant_frequency[0], dominant_frequency[1], dominant_frequency[2], detNote[0], detNote[1], detNote[2]); 
                    } 
                    else if(dominant_frequency[2] != 0)
                    {
                        length = snprintf(str, sizeof(str), "%.0lfHz, %.0lfHz, %s, %s\n", dominant_frequency[0], dominant_frequency[1], detNote[0], detNote[1]);
                    }
                    else
                    {
                        length = snprintf(str, sizeof(str), "%.0lfHz, %s\n", dominant_frequency[0], detNote[0]);
                    }
                }
                // Make sure length does not exceed buffer size
                length = (length < sizeof(str)) ? length : sizeof(str) - 1;
                lws_write(wsi_global, (unsigned char *)str, length, LWS_WRITE_TEXT);
            }

            fftw_destroy_plan(p);
            fftw_free(out);

            // Reset bufferIndex to 0 for next chunk
            bufferIndex = 0;
        }

        recordingBuffer[bufferIndex] = static_cast<double>(input[i]);
        bufferIndex++;
    }

    return paContinue;
}

static int callback_websockets(struct lws *wsi, enum lws_callback_reasons reason, void *user, void *in, size_t len)
{
    switch (reason)
    {
    case LWS_CALLBACK_ESTABLISHED:
        printf("WebSocket connection established\n");
        wsi_global = wsi;
        break;

    case LWS_CALLBACK_CLOSED:
        printf("WebSocket connection closed\n");
        if (wsi == wsi_global)
        {
            wsi_global = NULL;
        }
        break;

    case LWS_CALLBACK_RECEIVE:
        printf("1\n");
        // We received data from the client
        strcpy(str, "Hello, world!");
        lws_write(wsi, (unsigned char *)str, 14, LWS_WRITE_TEXT);
        break;

    default:
        break;
    }

    return 0;
}

int main()
{
    memset(&info, 0, sizeof(info));
    info.port = port;
    info.iface = address;
    info.gid = -1;
    info.uid = -1;

    struct lws_protocols protocols[] = {
        {
            "websockets",
            callback_websockets,
            0,
            0,
        },
        {NULL, NULL, 0, 0} // End of the list
    };

    info.protocols = protocols;

    context = lws_create_context(&info);
    if (!context)
    {
        fprintf(stderr, "libwebsockets context creation failed\n");
        return 1;
    }

    printf("WebSocket server is running. Listening on port %d\n", port);

    PaError err = Pa_Initialize();
    if (err != paNoError)
    {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
        return 1;
    }

    PaStream *stream;
    err = Pa_OpenDefaultStream(&stream, 1, 0, paFloat32, SAMPLE_RATE, FRAMES_PER_BUFFER, audioCallback, nullptr);

    if (err != paNoError)
    {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
        return 1;
    }

    err = Pa_StartStream(stream);
    if (err != paNoError)
    {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
        return 1;
    }

    std::cout << "Press Enter to exit..." << std::endl;

    while (1)
    {
        lws_service(context, 50); // Handle incoming WebSocket connections
    }

    std::cin.get();

    err = Pa_StopStream(stream);
    if (err != paNoError)
    {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
    }

    Pa_Terminate();
    lws_context_destroy(context);
    return 0;
}