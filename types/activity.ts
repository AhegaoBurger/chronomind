export type RecurrenceType = "daily" | "weekly" | "monthly"

export interface RecurrenceRule {
  type: RecurrenceType
  days?: number[] // For weekly: 0 = Sunday, 1 = Monday, etc.
  until: Date | null // null means no end date
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Activity {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  isRecurring?: boolean
  recurrenceRule?: RecurrenceRule
  categoryId?: string
}

// Predefined categories
export const defaultCategories: Category[] = [
  { id: "work", name: "Work", color: "#4f46e5" },
  { id: "personal", name: "Personal", color: "#10b981" },
  { id: "health", name: "Health & Fitness", color: "#ef4444" },
  { id: "study", name: "Study", color: "#f59e0b" },
  { id: "social", name: "Social", color: "#8b5cf6" },
  { id: "errands", name: "Errands", color: "#6366f1" },
  { id: "family", name: "Family", color: "#ec4899" },
  { id: "other", name: "Other", color: "#6b7280" },
]
