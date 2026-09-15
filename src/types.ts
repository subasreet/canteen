export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';

export type CanteenStation =
  | 'Kitchen Prep'
  | 'Main Cooking Line'
  | 'Bakery & Dessert'
  | 'Beverage & Coffee'
  | 'Counter Service'
  | 'Hygiene & Sanitation'
  | 'Inventory & Storage';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  station: CanteenStation;
  avatar: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  station: CanteenStation;
  assignee: StaffMember;
  estimatedMinutes: number;
  actualMinutes?: number;
  dueTime: string; // e.g. "11:30 AM" or "Before Lunch Rush"
  dueDate: string; // e.g. "Today"
  checklist: ChecklistItem[];
  projectId?: string;
  tags: string[];
  createdAt: string;
  aiSuggested?: boolean;
}

export type ProjectStatus = 'on_track' | 'at_risk' | 'completed' | 'delayed';
export type ProjectCategory =
  | 'Sustainability'
  | 'Menu Innovation'
  | 'Tech & Automation'
  | 'Safety & Hygiene'
  | 'Supply Chain';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  progress: number; // 0 - 100
  targetDate: string;
  status: ProjectStatus;
  leader: string;
  budgetAllocated: number;
  budgetSpent: number;
  milestones: Milestone[];
  tags: string[];
}

export type CanteenShift = 'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner';

export interface CanteenMetrics {
  mealsServedToday: number;
  targetMeals: number;
  activeTokens: number;
  avgWaitTimeMinutes: number;
  foodWasteKg: number;
  foodWasteTargetKg: number;
  budgetCompliance: number;
  currentShift: CanteenShift;
  rushCountdownMinutes: number;
}

export interface MealToken {
  id: string;
  tokenNumber: string;
  counterName: string;
  items: string[];
  status: 'preparing' | 'ready' | 'picked_up';
  orderTime: string;
  customerType: 'Staff' | 'Student' | 'Visitor' | 'VIP';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedTasks?: Array<{
    title: string;
    description: string;
    priority: PriorityLevel;
    station: CanteenStation;
    estimatedMinutes: number;
  }>;
}

export interface PriorityMatrixSection {
  quadrant: 'urgent_important' | 'important_not_urgent' | 'urgent_not_important' | 'neither';
  title: string;
  subtitle: string;
  badgeColor: string;
}
