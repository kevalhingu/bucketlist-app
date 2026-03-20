import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from './dynamodb';
import { Goal, GoalFormData } from './types';
import { v4 as uuidv4 } from 'uuid';

export async function createGoal(data: GoalFormData): Promise<Goal> {
  const goal: Goal = {
    goalId: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: goal }));
  return goal;
}

export async function getGoals(): Promise<Goal[]> {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  const items = (result.Items || []) as Goal[];
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getGoal(goalId: string): Promise<Goal | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { goalId } })
  );
  return (result.Item as Goal) || null;
}

export async function updateGoal(
  goalId: string,
  data: Partial<GoalFormData>
): Promise<Goal> {
  const fields = Object.keys(data) as (keyof GoalFormData)[];
  const updateExpr = 'SET ' + fields.map((f) => `#${f} = :${f}`).join(', ');
  const exprNames = Object.fromEntries(fields.map((f) => [`#${f}`, f]));
  const exprValues = Object.fromEntries(fields.map((f) => [`:${f}`, data[f]]));

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { goalId },
      UpdateExpression: updateExpr,
      ExpressionAttributeNames: exprNames,
      ExpressionAttributeValues: exprValues,
      ReturnValues: 'ALL_NEW',
    })
  );
  return result.Attributes as Goal;
}

export async function deleteGoal(goalId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { goalId } })
  );
}
