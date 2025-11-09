"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RequestModal } from "@/components/request-modal"
import { ArrowLeft, Calendar, Ruler, Palette, Tag } from "lucide-react"
import Link from "next/link"
import { fetchItem, type Item } from "@/lib/api"

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)

  const loadItem = useCallback(async () => {
    if (!params.id) {
      return
    }
    setLoading(true)
    try {
      const itemId = Array.isArray(params.id) ? params.id[0] : params.id
      const data = await fetchItem(Number(itemId))
      setItem(data)
    } catch (error) {
      console.error("[v0] Error fetching item:", error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadItem()
  }, [loadItem])

  if (loading) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-6 h-10 w-32" />
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <h1 className="mb-4 text-2xl font-bold">Item Not Found</h1>
            <Button asChild>
              <Link href="/catalog">Back to Catalog</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Item Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-lg bg-muted">
            <img
              src={item.image_url || `/placeholder.svg?height=800&width=600&query=${encodeURIComponent(item.name)}`}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{item.name}</h1>
                <p className="text-xl text-muted-foreground">{item.brand}</p>
              </div>
              <Badge variant={item.status === "available" ? "default" : "secondary"} className="text-sm">
                {item.status === "available" ? "Available" : "Rented"}
              </Badge>
            </div>

            {/* Description */}
            {item.description && (
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            )}

            {/* Specifications */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Size</p>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Color</p>
                      <p className="text-sm text-muted-foreground">{item.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                    </div>
                  </div>
                  {item.status === "rented" && item.rental_end_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Available From</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.rental_end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              <Button
                size="lg"
                className="w-full"
                disabled={item.status === "rented"}
                onClick={() => setShowRequestModal(true)}
              >
                {item.status === "available" ? "Request to Borrow" : "Currently Unavailable"}
              </Button>
              {item.status === "rented" && (
                <p className="text-center text-sm text-muted-foreground">
                  This item is currently rented. Check back later!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          item={item}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false)
            router.push("/requests")
          }}
        />
      )}
    </main>
  )
}
