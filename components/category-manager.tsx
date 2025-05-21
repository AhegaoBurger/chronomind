"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Trash2 } from "lucide-react"
import type { Category } from "@/types/activity"
import { defaultCategories } from "@/types/activity"

interface CategoryManagerProps {
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
}

export function CategoryManager({ categories = defaultCategories, onCategoriesChange }: CategoryManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [categoryColor, setCategoryColor] = useState("#4f46e5")

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryName(category.name)
      setCategoryColor(category.color)
    } else {
      setEditingCategory(null)
      setCategoryName("")
      setCategoryColor("#4f46e5")
    }
    setIsDialogOpen(true)
  }

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((c) =>
        c.id === editingCategory.id ? { ...c, name: categoryName, color: categoryColor } : c,
      )
      onCategoriesChange(updatedCategories)
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.random().toString(36).substring(2, 9),
        name: categoryName,
        color: categoryColor,
      }
      onCategoriesChange([...categories, newCategory])
    }

    setIsDialogOpen(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((c) => c.id !== categoryId)
    onCategoriesChange(updatedCategories)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button onClick={() => handleOpenDialog()} className="gap-1">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Color</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: category.color }} />
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)} className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryColor">Color</Label>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: categoryColor }} />
                <Input
                  id="categoryColor"
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  className="h-10 w-20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
