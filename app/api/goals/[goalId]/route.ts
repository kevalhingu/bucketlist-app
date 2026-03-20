import { NextRequest, NextResponse } from 'next/server';
import { getGoal, updateGoal, deleteGoal } from '@/lib/goals';

type Params = { params: Promise<{ goalId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { goalId } = await params;
    const goal = await getGoal(goalId);
    if (!goal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(goal);
  } catch (err) {
    console.error('GET /api/goals/[goalId] error:', err);
    return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { goalId } = await params;
    const body = await req.json();
    const goal = await updateGoal(goalId, body);
    return NextResponse.json(goal);
  } catch (err) {
    console.error('PATCH /api/goals/[goalId] error:', err);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { goalId } = await params;
    await deleteGoal(goalId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/goals/[goalId] error:', err);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
