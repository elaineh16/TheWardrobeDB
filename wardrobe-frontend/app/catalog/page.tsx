"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { CatalogFilters } from "@/components/catalog-filters"
import { ItemCard } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SlidersHorizontal } from "lucide-react"
import { fetchItems as fetchItemsFromApi, type Item } from "@/lib/api"

function CatalogContent() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    size: "",
    color: "",
    brand: "",
    availability: "all",
  })

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const sanitize = (value: string) => (value && value !== "all" ? value : undefined)

      const data = await fetchItemsFromApi({
        category: sanitize(filters.category),
        size: sanitize(filters.size),
        color: sanitize(filters.color),
        brand: sanitize(filters.brand),
        status: filters.availability !== "all" ? filters.availability : undefined,
      })
      setItems(data)
    } catch (error) {
      console.error("[v0] Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Browse Catalog</h1>
          <p className="text-muted-foreground">Discover our collection of premium clothing available for rent</p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <CatalogFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"} found
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mb-6 rounded-lg border border-border bg-card p-4 lg:hidden">
                <CatalogFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            )}

            {/* Items Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
                <p className="mb-2 text-lg font-semibold">No items found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  )
}
