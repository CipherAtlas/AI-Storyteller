export interface StorySegment {
  text: string;
  speaker: 'user' | 'ai';
  timestamp: number;
}

export interface AudioRecorderState {
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}