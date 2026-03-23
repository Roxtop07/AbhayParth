export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { Concept } from '../../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const due = searchParams.get('due');
  const todayStr = new Date().toISOString().slice(0, 10);

  try {
    let concepts;
    if (due === 'true') {
      concepts = db.prepare('SELECT * FROM concepts WHERE next_review <= ? ORDER BY next_review ASC').all(todayStr);
    } else {
      concepts = db.prepare('SELECT * FROM concepts ORDER BY id DESC').all();
    }
    
    // Parse tags JSON
    const parsed = concepts.map((c: any) => ({
      ...c,
      tags: JSON.parse(c.tags || '[]')
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, subtopic, summary, tags = [] } = body;
    const todayStr = new Date().toISOString().slice(0, 10);

    const info = db.prepare(`
      INSERT INTO concepts (topic, subtopic, summary, tags, ef, interval, reps, next_review, strength)
      VALUES (?, ?, ?, ?, 2.5, 1, 0, ?, 10)
    `).run(topic, subtopic, summary, JSON.stringify(tags), todayStr);

    const newConcept = db.prepare('SELECT * FROM concepts WHERE id = ?').get(info.lastInsertRowid) as Concept;
    newConcept.tags = JSON.parse((newConcept as any).tags);
    
    return NextResponse.json(newConcept, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
