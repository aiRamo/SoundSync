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

float noteFreq[75] = 
{
0,
16.35, //note number 1
17.32, //note number 2
18.35, //note number 3
19.45, //note number 4
20.60, //note number 5
21.83, //note number 6
23.12, //note number 7
24.50, //note number 8
25.96, //note number 9
27.50, //note number 10
29.14, //note number 11
30.87, //note number 12
32.70, //note number 13
34.65, //note number 14
36.71, //note number 15
38.89, //note number 16
41.20, //note number 17
43.65, //note number 18
46.25, //note number 19
49.00, //note number 20
51.91, //note number 21
55.00, //note number 22
58.27, //note number 23
61.74, //note number 24
65.41, //note number 25
69.30, //note number 26
73.42, //note number 27
77.78, //note number 28
82.41, //note number 29
87.31, //note number 30
92.50, //note number 31
98.00, //note number 32
103.83, //note number 33
110.00, //note number 34
116.54, //note number 35
123.47, //note number 36
130.81, //note number 37
138.59, //note number 38
146.83, //note number 39
155.56, //note number 40
164.81, //note number 41
174.61, //note number 42
185.00, //note number 43
196.00, //note number 44
207.65, //note number 45
220.00, //note number 46
233.08, //note number 47
246.94, //note number 48
261.63, //note number 49
277.18, //note number 50
293.66, //note number 51
311.13, //note number 52
329.63, //note number 53
349.23, //note number 54
369.99, //note number 55
392.00, //note number 56
415.30, //note number 57
440.00, //note number 58
466.16, //note number 59
493.88, //note number 60
523.25, //note number 61
554.37, //note number 62
587.33, //note number 63
622.25, //note number 64
659.25, //note number 65
698.46, //note number 66
739.99, //note number 67
783.99, //note number 68
830.61, //note number 69
880.00, //note number 70
932.33, //note number 71
987.77, //note number 72
1046.50, //note number 73
1108.73, //note number 74
};

char* noteName[75] = 
{
NULL,
NULL, //note number 1
NULL, //note number 2
NULL, //note number 3
NULL, //note number 4
NULL, //note number 5
NULL, //note number 6
NULL, //note number 7
NULL, //note number 8
NULL, //note number 9
NULL, //note number 10
NULL, //note number 11
NULL, //note number 12
NULL, //note number 13
NULL, //note number 14
NULL, //note number 15
NULL, //note number 16
NULL, //note number 17
NULL, //note number 18
NULL, //note number 19
NULL, //note number 20
NULL, //note number 21
NULL, //note number 22
NULL, //note number 23
NULL, //note number 24
NULL, //note number 25
NULL, //note number 26
NULL, //note number 27
"Eb2", //note number 28
"E2", //note number 29
"F2", //note number 30
"Gb2", //note number 31
"G2", //note number 32
"Ab2", //note number 33
"A2", //note number 34
"Bb2", //note number 35
"B2", //note number 36
"C3", //note number 37
"Db3", //note number 38
"D3", //note number 39
"Eb3", //note number 40
"E3", //note number 41
"F3", //note number 42
"Gb3", //note number 43
"G3", //note number 44
"Ab3", //note number 45
"A3", //note number 46
"Bb3", //note number 47
"B3", //note number 48
"C4", //note number 49
"Db4", //note number 50
"D4", //note number 51
"Eb4", //note number 52
"E4", //note number 53
"F4", //note number 54
"Gb4", //note number 55
"G4", //note number 56
"Ab4", //note number 57
"A4", //note number 58
"Bb4", //note number 59
"B4", //note number 60
"C5", //note number 61
"Db5", //note number 62
"D5", //note number 63
"Eb5", //note number 64
"E5", //note number 65
"F5", //note number 66
"Gb5", //note number 67
"G5", //note number 68
"Ab5", //note number 69
"A5", //note number 70
"Bb5", //note number 71
"B5", //note number 72
"C6", //note number 73
NULL, //note number 74
};

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
                    if (((float)(i % localMaximums[0]) / localMaximums[0] > 0.2) && ((float)(i % localMaximums[0]) / localMaximums[0] < 0.8)) {
                        //printf("%d, %d, %f\n", i, localMaximums[0], (float)(i % localMaximums[0]) / i);
                        localMaximums[1] = i;
                        count++;
                    }
                    break;
                case 2:
                    if (((float)(i % localMaximums[0]) / localMaximums[0] > 0.2) && ((float)(i % localMaximums[0]) / localMaximums[0] < 0.8) &&
                        ((float)(i % localMaximums[1]) / localMaximums[1] > 0.2) && ((float)(i % localMaximums[1]) / localMaximums[1] < 0.8)) {
                        localMaximums[2] = i;
                        break;
                    }
                    break;
            }
                }

            }
        
                

            double dominant_frequency[3] = {0};
            for(int i=0;i<3;i++)
            {   
                dominant_frequency[i] = static_cast<double>(localMaximums[i]) * (SAMPLE_RATE / static_cast<double>(CHUNK_SIZE));
                //printf("%d: %.2f\n", i+1,dominant_frequency[i]);
            }

            int dif = 1000;
//            float detNoteFreq[3] = {0};
            char* detNote[3] = {0};
            for(int j=0;j<3;j++)   
            {
                for(int i = 0; i < 75; i++)
                {
                    if(abs(dominant_frequency[j] - noteFreq[i]) < dif)
                    {
//                        detNoteFreq[j] = noteFreq[i];
                        dif = abs(dominant_frequency[j] - noteFreq[i]);
                        detNote[j] = noteName[i];
                    }
                }
            }
            

            //std::string note = findNote(dominant_frequency);
            // std::cout << "The frequency " << dominant_frequency << " Hz corresponds to the note " << note << std::endl;

            if (wsi_global)
            {
//                printf("In global\n");
                int length;
                // if(detNoteFreq[0] < 1100 && detNoteFreq[0] > 65)
                // {
                //     if(dominant_frequency[1] > 0 && dominant_frequency[1] < 1100)
                //     {
                //         length = snprintf(str, sizeof(str), "%.0lfHz, %.0lfHz, %.0lfHz, %s, %s, %s\n", dominant_frequency[0], dominant_frequency[1], dominant_frequency[2], detNote[0], detNote[1], detNote[2]); 
                //     } 
                //     else if(dominant_frequency[2] > 0 && dominant_frequency[2] < 1100)
                //     {
                //         length = snprintf(str, sizeof(str), "%.0lfHz, %.0lfHz, %s, %s\n", dominant_frequency[0], dominant_frequency[1], detNote[0], detNote[1]);
                //     }
                //     else
                //     {
                //         length = snprintf(str, sizeof(str), "%.0lfHz, %s\n", dominant_frequency[0], detNote[0]);
                //     }
                // }
                if(detNote[0] != NULL)
                {
                    if((detNote[1] != NULL) && (detNote[2] != NULL))
                    {
                        length = snprintf(str, sizeof(str), "%.0lfHz, %.0lfHz, %.0lfHz, %s, %s, %s\n", dominant_frequency[0], dominant_frequency[1], dominant_frequency[2], detNote[0], detNote[1], detNote[2]); 
                    }
                    else if((detNote[1] != NULL))
                    {
                        length = snprintf(str, sizeof(str), "%.0lfHz, %.0lfHz, %s, %s\n", dominant_frequency[0], dominant_frequency[1], detNote[0], detNote[1]);
                    }
                    else
                    {
                        length = snprintf(str, sizeof(str), "%.0lfHz, %s\n", dominant_frequency[0], detNote[0]);
                    }
                }
                else
                {
                    //strcpy(str, "-");
                }
                // Make sure length does not exceed buffer size
                length = (length < sizeof(str)) ? length : sizeof(str) - 1;
                //printf("String: %s", str);
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