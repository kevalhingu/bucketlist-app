import { NextRequest, NextResponse } from 'next/server';
import { createGoal, getGoals } from '@/lib/goals';

export async function GET() {
  try {
    const goals = await getGoals();
    return NextResponse.json(goals);
  } catch (err) {
    console.error('GET /api/goals error:', err);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const goal = await createGoal(body);
    return NextResponse.json(goal, { status: 201 });
  } catch (err) {
    console.error('POST /api/goals error:', err);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
