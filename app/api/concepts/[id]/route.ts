export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { sm2, computeStrength, todayISO } from '../../../../lib/sm2';
import { Concept } from '../../../../types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { quality } = await request.json();
    const id = Number(params.id);

    // Fetch existing concept
    const concept = db.prepare('SELECT * FROM concepts WHERE id = ?').get(id) as any;
    if (!concept) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // SM-2 update
    const result = sm2({ ef: concept.ef, interval: concept.interval, reps: concept.reps }, quality);
    const strength = computeStrength({ ...result, nextReview: result.nextReview });

    // DB Update
    db.prepare(`
      UPDATE concepts 
      SET ef = ?, interval = ?, reps = ?, next_review = ?, strength = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(result.ef, result.interval, result.reps, result.nextReview, strength, id);

    // Log Session
    db.prepare(`
      INSERT INTO sessions (session_type, subject, duration_minutes, concepts_reviewed, created_at)
      VALUES ('review', ?, 1, 1, datetime('now'))
    `).run(concept.topic);

    const updated = db.prepare('SELECT * FROM concepts WHERE id = ?').get(id) as Concept;
    updated.tags = JSON.parse((updated as any).tags);
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM concepts WHERE id = ?').run(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
