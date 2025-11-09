import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Item } from "@/lib/api"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const isAvailable = item.status === "available"
  const statusLabel = item.status.replace("_", " ")

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/item/${item.id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={item.image_url || `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(item.name)}`}
            alt={item.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link href={`/item/${item.id}`} className="hover:underline">
            <h3 className="font-semibold leading-tight">{item.name}</h3>
          </Link>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
          </Badge>
        </div>
        <p className="mb-1 text-sm text-muted-foreground">{item.brand}</p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Size: {item.size}</span>
          <span>•</span>
          <span>{item.color}</span>
        </div>
        {item.status === "rented" && item.rental_end_date && (
          <p className="mt-2 text-xs text-muted-foreground">
            Available: {new Date(item.rental_end_date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" disabled={!isAvailable}>
          <Link href={`/item/${item.id}`}>{isAvailable ? "View Details" : "View Item"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
