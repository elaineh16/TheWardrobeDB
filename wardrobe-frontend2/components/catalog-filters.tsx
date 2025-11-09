"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CatalogFiltersProps {
  filters: {
    category: string
    size: string
    color: string
    brand: string
    availability: string
  }
  onFilterChange: (filters: CatalogFiltersProps["filters"]) => void
}

export function CatalogFilters({ filters, onFilterChange }: CatalogFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      category: "",
      size: "",
      color: "",
      brand: "",
      availability: "all",
    })
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value && (key !== "availability" || value !== "all"),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Category</Label>
        <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="womens">Women's</SelectItem>
            <SelectItem value="mens">Men's</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="formal">Formal Wear</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Size</Label>
        <Select value={filters.size} onValueChange={(value) => updateFilter("size", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="XS">XS</SelectItem>
            <SelectItem value="S">S</SelectItem>
            <SelectItem value="M">M</SelectItem>
            <SelectItem value="L">L</SelectItem>
            <SelectItem value="XL">XL</SelectItem>
            <SelectItem value="XXL">XXL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Color</Label>
        <Select value={filters.color} onValueChange={(value) => updateFilter("color", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            <SelectItem value="Black">Black</SelectItem>
            <SelectItem value="White">White</SelectItem>
            <SelectItem value="Blue">Blue</SelectItem>
            <SelectItem value="Red">Red</SelectItem>
            <SelectItem value="Gray">Gray</SelectItem>
            <SelectItem value="Navy">Navy</SelectItem>
            <SelectItem value="Beige">Beige</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Brand</Label>
        <Select value={filters.brand} onValueChange={(value) => updateFilter("brand", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="Hugo Boss">Hugo Boss</SelectItem>
            <SelectItem value="Calvin Klein">Calvin Klein</SelectItem>
            <SelectItem value="Ralph Lauren">Ralph Lauren</SelectItem>
            <SelectItem value="Brooks Brothers">Brooks Brothers</SelectItem>
            <SelectItem value="J.Crew">J.Crew</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Availability</Label>
        <RadioGroup value={filters.availability} onValueChange={(value) => updateFilter("availability", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal">
              All Items
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="available" id="available" />
            <Label htmlFor="available" className="font-normal">
              Available Now
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rented" id="rented" />
            <Label htmlFor="rented" className="font-normal">
              Currently Rented
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
