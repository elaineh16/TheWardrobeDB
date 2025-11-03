from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Item, Member, Request, Rental, Log

app = FastAPI(title="Cornell Wardrobe API")

# Database setup
engine = create_engine("sqlite:///wardrobe.db", echo=False)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

# Helper: create a session
def get_session():
    return SessionLocal()

# ---------- ITEM ROUTES ----------

@app.get("/items")
def get_all_items():
    """Get all items in inventory"""
    session = get_session()
    items = session.query(Item).all()
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
    new_request = Request(
        member_id=req["member_id"],
        item_id=req["item_id"],
        status="pending",
    )
    session.add(new_request)
    session.commit()
    session.refresh(new_request)
    session.close()
    return {"message": "✅ Request submitted!", "request_id": new_request.request_id}


@app.get("/requests")
def get_requests():
    """View all pending requests"""
    session = get_session()
    reqs = session.query(Request).all()
    session.close()
    return [
        {
            "id": r.request_id,
            "item_id": r.item_id,
            "member_id": r.member_id,
            "status": r.status,
            "request_date": str(r.request_date),
        }
        for r in reqs
    ]


# ---------- RENTAL ROUTES ----------

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
    total_items =_
