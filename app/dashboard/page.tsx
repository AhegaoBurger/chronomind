"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/calendar"
import { ActivityDialog } from "@/components/activity-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import { AIChat } from "@/components/ai-chat"
import { useToast } from "@/hooks/use-toast"
import type { Activity, Category } from "@/types/activity"
import { defaultCategories } from "@/types/activity"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CategoryManager } from "@/components/category-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sampleActivities } from "@/data/sample-activities"

export default function DashboardPage() {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [activities, setActivities] = useState<Activity[]>([])
  const { toast } = useToast()

  // Initialize with sample activities
  useEffect(() => {
    setActivities(sampleActivities)
  }, [])

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsActivityDialogOpen(true)
  }

  const handleCreateActivity = () => {
    setSelectedActivity(null)
    setIsActivityDialogOpen(true)
  }

  const handleSaveActivity = (activity: Activity) => {
    if (selectedActivity) {
      // Update existing activity
      setActivities(activities.map((a) => (a.id === selectedActivity.id ? activity : a)))
    } else {
      // Add new activity
      setActivities([...activities, activity])
    }

    toast({
      title: selectedActivity ? "Activity updated" : "Activity created",
      description: `${activity.title} has been ${selectedActivity ? "updated" : "added"} to your calendar.`,
    })
    setIsActivityDialogOpen(false)
  }

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter((a) => a.id !== activityId))

    toast({
      title: "Activity deleted",
      description: "The activity has been removed from your calendar.",
    })
    setIsActivityDialogOpen(false)
  }

  const handleAISuggestion = (activity: Activity) => {
    // Assign a unique ID to the activity before adding
    const newActivityWithId = {
      ...activity,
      id: `ai-${Date.now().toString()}` // Prefixing to denote AI origin and ensure uniqueness
    };

    // Add the suggested activity to the calendar
    setActivities([...activities, newActivityWithId])

    toast({
      title: "Activity added by AI",
      description: `${newActivityWithId.title} has been added to your calendar.`,
    })
  }

  const handleCategoriesChange = (newCategories: Category[]) => {
    setCategories(newCategories)
    toast({
      title: "Categories updated",
      description: "Your activity categories have been updated.",
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreateActivity} className="gap-1">
            <Plus className="h-4 w-4" /> Add Activity
          </Button>
          <Button variant="outline" onClick={() => setIsAIChatOpen(true)}>
            AI Assistant
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Calendar Settings</SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="categories" className="mt-6">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>
                <TabsContent value="categories" className="mt-4">
                  <CategoryManager categories={categories} onCategoriesChange={handleCategoriesChange} />
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Calendar onActivityClick={handleActivityClick} categories={categories} activities={activities} />
      </div>

      <ActivityDialog
        open={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        activity={selectedActivity}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        categories={categories}
      />

      <AIChat
        open={isAIChatOpen}
        onOpenChange={setIsAIChatOpen}
        onSuggestionAccept={handleAISuggestion}
        activities={activities}
      />
    </div>
  )
}
