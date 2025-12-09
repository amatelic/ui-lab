export class AudioRecordingService {
  recorder: MediaRecorder;
  files: File[] = [];
  isRecording = false;
  recognition: SpeechRecognition;
  transcribedSpeech: string = "";

  constructor(private stream: MediaStream) {
    // this.recorder = new MediaRecorder(stream);
    this.recognition = new SpeechRecognition();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.continuous = false;
  }

  async startRecording() {
    try {
      this.isRecording = true;
      // this.recorder = new MediaRecorder(stream);
      // const chunks: Blob[] = [];

      // this.recorder.ondataavailable = (e) => chunks.push(e.data);
      // this.recorder.onstop = () => {
      //   const audioBlob = new Blob(chunks, { type: "audio/wav" });
      //   const audioFile = new File([audioBlob], "recording.wav", {
      //     type: "audio/wav",
      //   });
      //   this.files.push(audioFile);
      // };

      // this.recorder.start();
      this.recognition.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }
  async stop(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.recognition.onresult = (event) => {
        this.transcribedSpeech += event.results[0][0].transcript.toLowerCase();
        // this.recorder.stream.getTracks().forEach((track) => track.stop());
        // this.recognition.removeEventListener("result");
        resolve(this.transcribedSpeech);
      };

      this.recognition.onend = () => {
        console.log("Recognition ended");
      };

      this.recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
      };
      // this.recognition.onerror = (event) => {
      //   console.log("[TEST] audio", event);
      // };
      this.isRecording = false;
      // this.recorder.stop();
      this.recognition.stop();
    });
  }

  // transcribe(audioBlob) {
  //   const recognition = new (window.SpeechRecognition ||
  //     window.webkitSpeechRecognition)();
  //   recognition.lang = "en-US"; // Set language

  //   recognition.onresult = (event) => {
  //     const transcript = event.results[0][0].transcript;
  //     console.log("Transcript:", transcript);
  //   };
  // }

  toggleRecording() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.startRecording();
    }
  }
}

export async function recordingRef(): Promise<AudioRecordingService> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new AudioRecordingService(stream);
}
