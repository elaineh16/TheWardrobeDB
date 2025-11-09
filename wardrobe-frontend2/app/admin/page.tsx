"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Users, Clock, CheckCircle, XCircle, Edit } from "lucide-react"
import { UpdateItemModal } from "@/components/update-item-modal"
import {
  fetchAdminOverview,
  fetchItems,
  fetchRequests,
  updateItem,
  updateRequestStatus,
  type AdminOverview,
  type Item,
  type Request,
} from "@/lib/api"

export default function AdminPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [overviewData, itemData, requestData] = await Promise.all([
        fetchAdminOverview(),
        fetchItems(),
        fetchRequests(),
      ])

      setOverview(overviewData)
      setItems(itemData)
      setRequests(requestData)
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = async (itemId: number, updates: Partial<Item>) => {
    try {
      await updateItem(itemId, updates)
      fetchData()
      setSelectedItem(null)
    } catch (error) {
      console.error("[v0] Error updating item:", error)
    }
  }

  const handleUpdateRequest = async (requestId: number, status: Request["status"]) => {
    try {
      await updateRequestStatus(requestId, status)
      fetchData()
    } catch (error) {
      console.error("[v0] Error updating request:", error)
    }
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage inventory, rentals, and approve requests</p>
        </div>

        {/* Overview Stats */}
        {loading ? (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : overview ? (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.total_items}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.available_items}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rented</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.rented_items}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.pending_requests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.active_rentals}</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Tabs */}
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="rentals">Active Rentals</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Available Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.size}</TableCell>
                            <TableCell>{item.color}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === "available" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.rental_end_date ? new Date(item.rental_end_date).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Borrower</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests
                          .filter((req) => req.status === "pending")
                          .map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">
                                {request.item_name || `Item #${request.item_id}`}
                              </TableCell>
                              <TableCell>{request.borrower_name || `User #${request.borrower_id}`}</TableCell>
                              <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{request.purpose || "-"}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{request.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateRequest(request.id, "approved")}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateRequest(request.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {requests.filter((req) => req.status === "pending").length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                              No pending requests
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Rentals Tab */}
          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>Active Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Borrower</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests
                          .filter((req) => req.status === "active" || req.status === "approved")
                          .map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">
                                {request.item_name || `Item #${request.item_id}`}
                              </TableCell>
                              <TableCell>{request.borrower_name || `User #${request.borrower_id}`}</TableCell>
                              <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={request.status === "active" ? "default" : "secondary"}>
                                  {request.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateRequest(request.id, "completed")}
                                >
                                  Mark Returned
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        {requests.filter((req) => req.status === "active" || req.status === "approved").length ===
                          0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No active rentals
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedItem && (
        <UpdateItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onUpdate={handleUpdateItem} />
      )}
    </main>
  )
}
