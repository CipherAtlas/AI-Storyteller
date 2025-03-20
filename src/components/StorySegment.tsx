'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { StorySegment as StorySegmentType } from '@/types';

interface StorySegmentProps {
  segment: StorySegmentType;
}

const StorySegment: React.FC<StorySegmentProps> = ({ segment }) => {
  const isAI = segment.speaker === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isAI
            ? 'bg-violet-100 text-violet-900'
            : 'bg-emerald-100 text-emerald-900'
        } shadow-md`}
      >
        <p className="text-lg leading-relaxed">{segment.text}</p>
        <p className="text-sm opacity-50 mt-2">
          {new Date(segment.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

export default StorySegment;