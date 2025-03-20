import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { previousSegments, userInput } = await request.json();

    const conversation = previousSegments.map((segment: any) => ({
      role: segment.speaker === 'user' ? 'user' : 'assistant',
      content: segment.text,
    }));

    conversation.push({ role: 'user', content: userInput });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative storyteller who helps users craft interactive stories. Continue the narrative based on the user\'s input, maintaining consistency and adding engaging elements. Make sure to not make it too long. 100 or so words are more than enough',
        },
        ...conversation,
      ],
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Error generating story' },
      { status: 500 }
    );
  }
}