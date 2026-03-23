export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { stream } from '../../../lib/claude';

export const runtime = 'nodejs'; // Required for better-sqlite3 but we dont use it here except maybe logging later

export async function POST(request: Request) {
  try {
    const { messages, subject, language, exam } = await request.json();

    const targetExam = exam || 'Indian competitive exams';
    const SYSTEM_PROMPT = `You are a helpful, conversational AI Tutor for ${targetExam} aspirants, behaving exactly like ChatGPT.
Your knowledge base includes standard textbooks and PyQs for ${targetExam}.

Current Topic: ${subject}
Language: ${language || 'English'}

STRICT CONSTRAINTS:
1. ALWAYS respond entirely in clear, conversational ${language || 'English'}. If the language is 'Hinglish', mix English technical terms with Hindi safely.
2. DO NOT over-use formatting. Write naturally like a human tutor speaking.
3. Prioritize concise, actionable answers. Keep responses short and directly to the point.
4. Give a single, cohesive explanation without heavy bullet-point lists or excessive "Exam Tips" blocks unless strictly necessary.`;

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          await stream(messages, SYSTEM_PROMPT, (text) => {
            controller.enqueue(encoder.encode(text));
          });
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Tutor API Error:', error);
    return NextResponse.json({ error: 'Failed to stream response' }, { status: 500 });
  }
}
