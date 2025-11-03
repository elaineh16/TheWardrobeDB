from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker
from models import Base, Item, Member, Request, Rental, Log
from datetime import date

app = FastAPI(title="Cornell Wardrobe API")

# Database setup
engine = create_engine("sqlite:///wardrobe.db", echo=False)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper: create a session
def get_session():
    return SessionLocal()

# ---------- ITEM ROUTES ----------

@app.get("/items")
def get_all_items(
    category: str = None,
    size: str = None,
    color: str = None,
    brand: str = None,
    status: str = None
):
    """Get all items in inventory with optional filters"""
    session = get_session()
    query = session.query(Item)
    
    # Apply filters
    if category:
        query = query.filter(Item.category.ilike(f"%{category}%"))
    if size:
        query = query.filter(Item.size == size)
    if color:
        query = query.filter(Item.color.ilike(f"%{color}%"))
    if brand:
        query = query.filter(Item.brand.ilike(f"%{brand}%"))
    if status:
        query = query.filter(Item.status == status)
    
    items = query.all()
    session.close()
    
    return [
        {
            "id": i.item_id,
            "name": i.name,
            "category": i.category,
            "size": i.size,
            "color": i.color,
            "brand": i.brand,
            "status": i.status,
            "image_url": i.image_url,
        }
        for i in items
    ]


@app.get("/items/{item_id}")
def get_item(item_id: int):
    """Get a single item by ID"""
    session = get_session()
    item = session.query(Item).get(item_id)
    session.close()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {
        "id": item.item_id,
        "name": item.name,
        "category": item.category,
        "size": item.size,
        "color": item.color,
        "brand": item.brand,
        "status": item.status,
        "image_url": item.image_url,
    }


@app.post("/items")
def add_item(item: dict):
    """Add a new item to the inventory"""
    session = get_session()
    new_item = Item(
        name=item["name"],
        category=item.get("category"),
        size=item.get("size"),
        color=item.get("color"),
        brand=item.get("brand"),
        status=item.get("status", "available"),
        image_url=item.get("image_url"),
    )
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    session.close()
    return {"message": "✅ Item added!", "item_id": new_item.item_id}


@app.patch("/items/{item_id}")
def update_item(item_id: int, updates: dict):
    """Update an item"""
    session = get_session()
    item = session.query(Item).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update fields
    for key, value in updates.items():
        if hasattr(item, key):
            setattr(item, key, value)
    
    session.commit()
    session.close()
    return {"message": f"Item {item_id} updated successfully"}


@app.patch("/items/{item_id}/status")
def update_item_status(item_id: int, status: str):
    """Update an item's availability status"""
    session = get_session()
    item = session.query(Item).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.status = status
    session.commit()
    session.close()
    return {"message": f"Item {item_id} status updated to {status}"}


# ---------- REQUEST ROUTES ----------

@app.post("/requests")
def create_request(req: dict):
    """Submit a new rental request"""
    session = get_session()
    
    # Map frontend fields to database fields
    # Frontend sends: borrower_id, item_id, start_date, end_date, purpose
    start_date = req.get("start_date")
    end_date = req.get("end_date")
    
    new_request = Request(
        member_id=req.get("borrower_id") or req.get("member_id"),
        item_id=req["item_id"],
        start_date=date.fromisoformat(start_date) if start_date else None,
        end_date=date.fromisoformat(end_date) if end_date else None,
        purpose=req.get("purpose"),
        status="pending",
    )
    session.add(new_request)
    session.commit()
    session.refresh(new_request)
    session.close()
    return {"message": "✅ Request submitted!", "request_id": new_request.request_id}


@app.get("/requests")
def get_requests():
    """View all requests with related data"""
    session = get_session()
    reqs = session.query(Request).all()
    
    result = []
    for r in reqs:
        # Get related item and member info
        item = session.query(Item).get(r.item_id)
        member = session.query(Member).get(r.member_id)
        
        # Get associated rental if this request is approved/active
        rental = session.query(Rental).filter(
            Rental.item_id == r.item_id,
            Rental.member_id == r.member_id
        ).first()
        
        status = r.status
        if rental:
            if rental.status == "checked_out":
                status = "active"
            elif rental.status == "returned":
                status = "completed"
        
        result.append({
            "id": r.request_id,
            "item_id": r.item_id,
            "item_name": item.name if item else None,
            "item_brand": item.brand if item else None,
            "borrower_id": r.member_id,
            "borrower_name": member.name if member else None,
            "start_date": str(r.start_date) if r.start_date else str(r.request_date),
            "end_date": str(r.end_date) if r.end_date else str(r.request_date),
            "status": status,
            "purpose": r.purpose,
            "created_at": str(r.request_date),
        })
    
    session.close()
    return result


@app.get("/requests/{request_id}")
def get_request(request_id: int):
    """Get a single request by ID"""
    session = get_session()
    req = session.query(Request).get(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Get related data
    item = session.query(Item).get(req.item_id)
    member = session.query(Member).get(req.member_id)
    
    result = {
        "id": req.request_id,
        "item_id": req.item_id,
        "item_name": item.name if item else None,
        "item_brand": item.brand if item else None,
        "borrower_id": req.member_id,
        "borrower_name": member.name if member else None,
        "start_date": str(req.start_date) if req.start_date else None,
        "end_date": str(req.end_date) if req.end_date else None,
        "purpose": req.purpose,
        "status": req.status,
        "created_at": str(req.request_date),
    }
    
    session.close()
    return result


@app.patch("/requests/{request_id}")
def update_request(request_id: int, updates: dict):
    """Update a request (e.g., approve/reject)"""
    session = get_session()
    req = session.query(Request).get(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    status = updates.get("status")
    if status:
        req.status = status
        
        # If approving, create a rental record
        if status == "approved":
            # Check if rental already exists
            existing_rental = session.query(Rental).filter(
                Rental.item_id == req.item_id,
                Rental.member_id == req.member_id,
                Rental.status == "checked_out"
            ).first()
            
            if not existing_rental:
                # Get dates from the request if available, otherwise from updates
                checkout_date = req.start_date or updates.get("checkout_date")
                return_date = req.end_date or updates.get("expected_return_date")
                
                if isinstance(checkout_date, str):
                    checkout_date = date.fromisoformat(checkout_date)
                elif not checkout_date:
                    checkout_date = date.today()
                
                if isinstance(return_date, str):
                    return_date = date.fromisoformat(return_date)
                
                new_rental = Rental(
                    item_id=req.item_id,
                    member_id=req.member_id,
                    checkout_date=checkout_date,
                    expected_return_date=return_date,
                    status="checked_out",
                )
                
                # Update item status
                item = session.query(Item).get(req.item_id)
                if item:
                    item.status = "rented"
                
                session.add(new_rental)
    
    session.commit()
    session.close()
    return {"message": f"Request {request_id} updated successfully"}


# ---------- RENTAL ROUTES ----------

@app.get("/rentals")
def get_rentals():
    """Get all rentals"""
    session = get_session()
    rentals = session.query(Rental).all()
    
    result = []
    for rental in rentals:
        item = session.query(Item).get(rental.item_id)
        member = session.query(Member).get(rental.member_id)
        
        result.append({
            "id": rental.rental_id,
            "item_id": rental.item_id,
            "item_name": item.name if item else None,
            "member_id": rental.member_id,
            "member_name": member.name if member else None,
            "checkout_date": str(rental.checkout_date) if rental.checkout_date else None,
            "expected_return_date": str(rental.expected_return_date) if rental.expected_return_date else None,
            "actual_return_date": str(rental.actual_return_date) if rental.actual_return_date else None,
            "status": rental.status,
        })
    
    session.close()
    return result


@app.post("/rentals")
def checkout_item(data: dict):
    """Mark an item as checked out and create rental record"""
    session = get_session()
    new_rental = Rental(
        item_id=data["item_id"],
        member_id=data["member_id"],
        checkout_date=data.get("checkout_date"),
        expected_return_date=data.get("expected_return_date"),
        status="checked_out",
    )

    # Update item status to 'rented'
    item = session.query(Item).get(data["item_id"])
    if item:
        item.status = "rented"

    session.add(new_rental)
    session.commit()
    session.refresh(new_rental)
    session.close()
    return {"message": "✅ Item checked out!", "rental_id": new_rental.rental_id}


@app.patch("/rentals/{rental_id}/return")
def return_item(rental_id: int):
    """Mark a rental as returned"""
    session = get_session()
    rental = session.query(Rental).get(rental_id)
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")

    rental.status = "returned"
    rental.actual_return_date = date.today()
    item = session.query(Item).get(rental.item_id)
    if item:
        item.status = "available"

    session.commit()
    session.close()
    return {"message": f"✅ Rental {rental_id} marked as returned"}


# ---------- ADMIN DASHBOARD ----------

@app.get("/admin/overview")
def get_admin_summary():
    """Get counts of items, rentals, and requests"""
    session = get_session()
    
    total_items = session.query(Item).count()
    available_items = session.query(Item).filter(Item.status == "available").count()
    rented_items = session.query(Item).filter(Item.status == "rented").count()
    pending_requests = session.query(Request).filter(Request.status == "pending").count()
    active_rentals = session.query(Rental).filter(Rental.status == "checked_out").count()
    
    session.close()
    
    return {
        "total_items": total_items,
        "available_items": available_items,
        "rented_items": rented_items,
        "pending_requests": pending_requests,
        "active_rentals": active_rentals,
    }


# ---------- MEMBER ROUTES ----------

@app.get("/members")
def get_members():
    """Get all members"""
    session = get_session()
    members = session.query(Member).all()
    session.close()
    return [
        {
            "id": m.member_id,
            "name": m.name,
            "email": m.email,
            "role": m.role,
        }
        for m in members
    ]


@app.post("/members")
def add_member(member: dict):
    """Add a new member"""
    session = get_session()
    new_member = Member(
        name=member["name"],
        email=member["email"],
        role=member.get("role", "borrower"),
    )
    session.add(new_member)
    session.commit()
    session.refresh(new_member)
    session.close()
    return {"message": "✅ Member added!", "member_id": new_member.member_id}


# ---------- HEALTH CHECK ----------

@app.get("/")
def root():
    """Health check endpoint"""
    return {"message": "Cornell Wardrobe API is running", "version": "1.0.0"}
