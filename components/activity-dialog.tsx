"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Activity, RecurrenceType, Category } from "@/types/activity"
import { defaultCategories } from "@/types/activity"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity | null
  onSave: (activity: Activity) => void
  onDelete: (activityId: string) => void
  categories: Category[]
}

export function ActivityDialog({
  open,
  onOpenChange,
  activity,
  onSave,
  onDelete,
  categories = defaultCategories,
}: ActivityDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("daily")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [hasEndDate, setHasEndDate] = useState(false)
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    if (activity) {
      setTitle(activity.title)
      setDescription(activity.description || "")
      setStartDate(format(activity.start, "yyyy-MM-dd"))
      setStartTime(format(activity.start, "HH:mm"))
      setEndDate(format(activity.end, "yyyy-MM-dd"))
      setEndTime(format(activity.end, "HH:mm"))
      setIsRecurring(activity.isRecurring || false)
      setCategoryId(activity.categoryId || "")

      if (activity.recurrenceRule) {
        setRecurrenceType(activity.recurrenceRule.type)
        setSelectedDays(activity.recurrenceRule.days || [])
        setHasEndDate(!!activity.recurrenceRule.until)
        if (activity.recurrenceRule.until) {
          setRecurrenceEndDate(format(activity.recurrenceRule.until, "yyyy-MM-dd"))
        }
      }
    } else {
      // Default values for new activity
      const now = new Date()
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

      setTitle("")
      setDescription("")
      setStartDate(format(now, "yyyy-MM-dd"))
      setStartTime(format(now, "HH:mm"))
      setEndDate(format(oneHourLater, "yyyy-MM-dd"))
      setEndTime(format(oneHourLater, "HH:mm"))
      setIsRecurring(false)
      setRecurrenceType("daily")
      setSelectedDays([])
      setHasEndDate(false)
      setRecurrenceEndDate("")
      setCategoryId("")
    }
  }, [activity, open])

  const handleSave = () => {
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)

    const newActivity: Activity = {
      id: activity?.id || Math.random().toString(36).substring(2, 9),
      title,
      description,
      start,
      end,
      isRecurring,
      categoryId: categoryId || undefined,
      ...(isRecurring && {
        recurrenceRule: {
          type: recurrenceType,
          days: selectedDays,
          until: hasEndDate ? new Date(recurrenceEndDate) : null,
        },
      }),
    }

    onSave(newActivity)
  }

  const handleDelete = () => {
    if (activity) {
      onDelete(activity.id)
    }
  }

  const weekdays = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ]

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "Create Activity"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoryId && (
                <div className="mt-2">
                  <Badge
                    style={{
                      backgroundColor: categories.find((c) => c.id === categoryId)?.color,
                      color: "white",
                    }}
                  >
                    {categories.find((c) => c.id === categoryId)?.name}
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this activity"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="isRecurring">This is a recurring activity</Label>
            </div>
          </TabsContent>

          <TabsContent value="recurrence" className="space-y-4 py-4">
            {isRecurring ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="recurrenceType">Recurrence Pattern</Label>
                  <Select value={recurrenceType} onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}>
                    <SelectTrigger id="recurrenceType">
                      <SelectValue placeholder="Select recurrence pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recurrenceType === "weekly" && (
                  <div className="space-y-2">
                    <Label>Repeat on</Label>
                    <div className="flex flex-wrap gap-2">
                      {weekdays.map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.value}`}
                            checked={selectedDays.includes(day.value)}
                            onCheckedChange={() => toggleDay(day.value)}
                          />
                          <Label htmlFor={`day-${day.value}`}>{day.label.substring(0, 3)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasEndDate"
                    checked={hasEndDate}
                    onCheckedChange={(checked) => setHasEndDate(checked as boolean)}
                  />
                  <Label htmlFor="hasEndDate">End recurrence on specific date</Label>
                </div>

                {hasEndDate && (
                  <div className="space-y-2">
                    <Label htmlFor="recurrenceEndDate">End Date</Label>
                    <Input
                      id="recurrenceEndDate"
                      type="date"
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Enable recurring activities in the Basic Info tab to configure recurrence settings.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between sm:justify-between">
          {activity && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
