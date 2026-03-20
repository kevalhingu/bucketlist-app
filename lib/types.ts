export type Category = 'Travel' | 'Skill' | 'Adventure' | 'Career' | 'Personal';
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Planned' | 'In Progress' | 'Completed';

export interface Goal {
  goalId: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  targetDate: string;
  status: Status;
  createdAt: string;
}

export interface GoalFormData {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  targetDate: string;
  status: Status;
}
