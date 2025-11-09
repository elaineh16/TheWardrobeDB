const DEFAULT_API_URL = "http://localhost:8000"

const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL

const jsonHeaders = {
  "Content-Type": "application/json",
}

export type Item = {
  id: number
  name: string
  brand: string
  size: string
  color: string
  category: string
  status: "available" | "rented" | "repair" | "retired"
  image_url?: string
  rental_end_date?: string | null
  description?: string | null
}

export type Request = {
  id: number
  item_id: number
  item_name?: string
  item_brand?: string
  borrower_id: number
  borrower_name?: string
  start_date: string
  end_date: string
  status: "pending" | "approved" | "rejected" | "active" | "completed"
  purpose?: string
  created_at: string
}

export type AdminOverview = {
  total_items: number
  available_items: number
  rented_items: number
  pending_requests: number
  active_rentals: number
}

type ItemsFilter = {
  category?: string
  size?: string
  color?: string
  brand?: string
  status?: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = "Request failed"
    try {
      const data = await response.json()
      detail = data.detail || JSON.stringify(data)
    } catch {
      // ignore parse errors
    }
    throw new Error(detail)
  }

  return response.json() as Promise<T>
}

export async function fetchItems(filters: ItemsFilter = {}): Promise<Item[]> {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value)
    }
  })

  const url = `${API_URL}/items${params.toString() ? `?${params.toString()}` : ""}`
  const response = await fetch(url, { cache: "no-store" })

  return handleResponse<Item[]>(response)
}

export async function fetchItem(itemId: number | string): Promise<Item> {
  const response = await fetch(`${API_URL}/items/${itemId}`, { cache: "no-store" })
  return handleResponse<Item>(response)
}

export async function createRequest(payload: {
  item_id: number
  borrower_id: number
  start_date: string
  end_date: string
  purpose?: string
}) {
  const response = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })

  return handleResponse<{ message: string; request_id: number }>(response)
}

export async function fetchRequests(): Promise<Request[]> {
  const response = await fetch(`${API_URL}/requests`, { cache: "no-store" })
  return handleResponse<Request[]>(response)
}

export async function updateRequestStatus(requestId: number, status: Request["status"]) {
  const response = await fetch(`${API_URL}/requests/${requestId}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ status }),
  })

  return handleResponse<{ message: string }>(response)
}

export async function updateItem(itemId: number, updates: Partial<Item>) {
  const response = await fetch(`${API_URL}/items/${itemId}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(updates),
  })

  return handleResponse<{ message: string }>(response)
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const response = await fetch(`${API_URL}/admin/overview`, { cache: "no-store" })
  return handleResponse<AdminOverview>(response)
}

