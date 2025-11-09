"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Request {
  id: number
  item_name?: string
  borrower_name?: string
  start_date: string
  end_date: string
}

interface ApproveRequestModalProps {
  request: Request
  onClose: () => void
  onApprove: (requestId: number) => void
  onReject: (requestId: number) => void
}

export function ApproveRequestModal({ request, onClose, onApprove, onReject }: ApproveRequestModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Request</DialogTitle>
          <DialogDescription>Review and approve or reject this rental request</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium">Item</p>
            <p className="text-sm text-muted-foreground">{request.item_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Borrower</p>
            <p className="text-sm text-muted-foreground">{request.borrower_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Rental Period</p>
            <p className="text-sm text-muted-foreground">
              {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onReject(request.id)}>
            Reject
          </Button>
          <Button onClick={() => onApprove(request.id)}>Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
