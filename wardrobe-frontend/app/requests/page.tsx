"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchRequests, type Request } from "@/lib/api"

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await fetchRequests()
      setRequests(data)
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Request["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "approved":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      default:
        return ""
    }
  }

  const filterRequests = (status?: string) => {
    if (!status || status === "all") return requests
    return requests.filter((req) => req.status === status)
  }

  const RequestCard = ({ request }: { request: Request }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{request.item_name || `Item #${request.item_id}`}</CardTitle>
            {request.item_brand && <p className="mt-1 text-sm text-muted-foreground">{request.item_brand}</p>}
          </div>
          <Badge className={getStatusColor(request.status)} variant="secondary">
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Rental Period:</span>
            <span className="font-medium">
              {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
            </span>
          </div>

          {request.purpose && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Purpose:</span>
                <p className="mt-1">{request.purpose}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Requested:</span>
            <span>{new Date(request.created_at).toLocaleDateString()}</span>
          </div>

          <div className="pt-2">
            <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
              <Link href={`/item/${request.item_id}`}>View Item Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">Track your rental requests and their current status</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                {filterRequests("all").length === 0 ? (
                  <Card>
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                      <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">No requests yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Browse the catalog and request items to get started
                      </p>
                      <Button asChild>
                        <Link href="/catalog">Browse Catalog</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filterRequests("all").map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-0">
                {filterRequests("pending").length === 0 ? (
                  <Card>
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                      <p className="text-muted-foreground">No pending requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filterRequests("pending").map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-0">
                {filterRequests("approved").length === 0 ? (
                  <Card>
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                      <p className="text-muted-foreground">No approved requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filterRequests("approved").map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                {filterRequests("active").length === 0 ? (
                  <Card>
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                      <p className="text-muted-foreground">No active rentals</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filterRequests("active").map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                {filterRequests("completed").length === 0 ? (
                  <Card>
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                      <p className="text-muted-foreground">No completed rentals</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filterRequests("completed").map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  )
}
