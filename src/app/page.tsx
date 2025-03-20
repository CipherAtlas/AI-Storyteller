'use client';

import { useState } from 'react';
import { Book, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioRecorder from '@/components/AudioRecorder';
import StorySegment from '@/components/StorySegment';
import type { StorySegment as StorySegmentType } from '@/types';

export default function Home() {
  const [storySegments, setStorySegments] = useState<StorySegmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      // Create form data for the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // First, transcribe the audio using Whisper
      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const { text: transcribedText } = await transcriptionResponse.json();

      // Add user's transcribed text to the story
      setStorySegments(prev => [...prev, {
        text: transcribedText,
        speaker: 'user',
        timestamp: Date.now()
      }]);

      // Get AI's response
      const aiResponse = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          previousSegments: storySegments,
          userInput: transcribedText 
        }),
      });
      const { response: aiText } = await aiResponse.json();

      // Add AI's response to the story
      setStorySegments(prev => [...prev, {
        text: aiText,
        speaker: 'ai',
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Error processing story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-8 h-8 text-violet-600" />
            <h1 className="text-4xl font-bold text-violet-900">
              Magic Storyteller
            </h1>
            <Sparkles className="w-8 h-8 text-violet-600" />
          </div>
          <p className="text-lg text-violet-700 mb-8">
            Speak your story and let AI magic bring it to life
          </p>
        </motion.div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <div className="max-h-[60vh] overflow-y-auto mb-6 space-y-4">
            {storySegments.map((segment, index) => (
              <StorySegment key={index} segment={segment} />
            ))}
          </div>

          <div className="flex justify-center items-center h-20">
            {isLoading ? (
              <div className="animate-pulse text-violet-600">
                Processing your story...
              </div>
            ) : (
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}