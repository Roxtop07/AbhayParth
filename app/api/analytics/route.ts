export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { Analytics, SubjectStat, DayActivity, CurvePoint } from '../../../types';

export async function GET() {
  try {
    const totalConcepts = (db.prepare('SELECT COUNT(*) as c FROM concepts').get() as { c: number }).c;
    
    const todayStr = new Date().toISOString().slice(0, 10);
    const dueToday = (db.prepare('SELECT COUNT(*) as c FROM concepts WHERE next_review <= ?').get(todayStr) as { c: number }).c;
    
    const masteredConcepts = (db.prepare('SELECT COUNT(*) as c FROM concepts WHERE strength >= 80').get() as { c: number }).c;
    
    const weakConcepts = (db.prepare('SELECT COUNT(*) as c FROM concepts WHERE strength <= 40').get() as { c: number }).c;
    
    const avgStrengthRow = db.prepare('SELECT AVG(strength) as a FROM concepts').get() as { a: number | null };
    const avgStrength = avgStrengthRow.a ? Math.round(avgStrengthRow.a) : 0;

    const subjectsDb = db.prepare(`
      SELECT topic as subject, COUNT(*) as count, AVG(strength) as avgStrength, 
             SUM(CASE WHEN next_review <= ? THEN 1 ELSE 0 END) as due
      FROM concepts 
      GROUP BY topic
    `).all(todayStr) as { subject: string; count: number; avgStrength: number; due: number }[];

    const subjectBreakdown: SubjectStat[] = subjectsDb.map(s => ({
      ...s,
      avgStrength: Math.round(s.avgStrength),
      due: s.due || 0
    }));

    // Weekly activity (last 7 days)
    const weeklyActivity: DayActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      
      const stats = db.prepare(`
        SELECT SUM(concepts_reviewed) as cards, SUM(duration_minutes) as mins
        FROM sessions
        WHERE date(created_at) = ?
      `).get(dateStr) as { cards: number | null, mins: number | null };

      weeklyActivity.push({
        date: dateStr.slice(5), // MM-DD
        cardsReviewed: stats.cards || 0,
        minutesStudied: stats.mins || 0
      });
    }

    // Synthetic forgetting curve data based on average strength
    const forgettingCurveData: CurvePoint[] = [];
    let currentStrength = avgStrength || 80;
    for (let i = 0; i < 30; i++) {
        forgettingCurveData.push({ day: i, retention: Math.max(0, Math.round(currentStrength)) });
        currentStrength = currentStrength * Math.exp(-0.05); // Simulated decay
    }

    const profileRaw = db.prepare('SELECT streak FROM profile WHERE id = 1').get() as { streak: number } | undefined;
    const studyStreak = profileRaw ? profileRaw.streak : 0;

    const analytics: Analytics = {
      totalConcepts,
      dueToday,
      masteredConcepts,
      weakConcepts,
      avgStrength,
      subjectBreakdown,
      studyStreak,
      weeklyActivity,
      forgettingCurveData
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
