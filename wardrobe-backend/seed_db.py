"""
Seed the database with sample data for Cornell Wardrobe
"""
from models import Base, create_engine, sessionmaker
from models import Item, Member, Request, Rental
from datetime import date, timedelta

# Create engine and session
engine = create_engine("sqlite:///wardrobe.db")
Session = sessionmaker(bind=engine)
session = Session()

# Clear existing data
print("Clearing existing data...")
session.query(Rental).delete()
session.query(Request).delete()
session.query(Item).delete()
session.query(Member).delete()
session.commit()

# ---------- Create Members ----------
print("Creating members...")
members = [
    Member(name="Alice Chen", email="ac123@cornell.edu", role="borrower"),
    Member(name="Bob Smith", email="bs456@cornell.edu", role="borrower"),
    Member(name="Carol Williams", email="cw789@cornell.edu", role="borrower"),
    Member(name="David Johnson", email="dj012@cornell.edu", role="borrower"),
    Member(name="Emily Staff", email="es_staff@cornell.edu", role="staff"),
    Member(name="Frank Admin", email="fa_admin@cornell.edu", role="staff"),
]
for member in members:
    session.add(member)
session.commit()
print(f"✅ Created {len(members)} members")

# ---------- Create Items ----------
print("Creating items...")
items = [
    # Women's formal wear
    Item(
        name="Navy Blue Professional Suit",
        category="Women's Formal",
        size="M",
        color="Navy",
        brand="Ann Taylor",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=womens%20suit",
    ),
    Item(
        name="Black A-Line Dress",
        category="Women's Formal",
        size="S",
        color="Black",
        brand="Calvin Klein",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=black%20dress",
    ),
    Item(
        name="Gray Blazer",
        category="Women's Formal",
        size="L",
        color="Gray",
        brand="J.Crew",
        status="rented",
        image_url="/placeholder.svg?height=400&width=300&query=gray%20blazer",
    ),
    Item(
        name="Blush Pink Cocktail Dress",
        category="Women's Formal",
        size="M",
        color="Pink",
        brand="Reformation",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=cocktail%20dress",
    ),
    Item(
        name="Charcoal Gray Pant Suit",
        category="Women's Formal",
        size="S",
        color="Gray",
        brand="Banana Republic",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=pant%20suit",
    ),
    
    # Men's formal wear
    Item(
        name="Navy Classic Suit",
        category="Men's Formal",
        size="42R",
        color="Navy",
        brand="Hugo Boss",
        status="available",
        image_url="/men-s-formal-suit-on-mannequin.jpg",
    ),
    Item(
        name="Black Tuxedo",
        category="Men's Formal",
        size="40R",
        color="Black",
        brand="Ralph Lauren",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=tuxedo",
    ),
    Item(
        name="Gray 3-Piece Suit",
        category="Men's Formal",
        size="44R",
        color="Gray",
        brand="Brooks Brothers",
        status="rented",
        image_url="/placeholder.svg?height=400&width=300&query=3piece%20suit",
    ),
    Item(
        name="Navy Blazer",
        category="Men's Formal",
        size="38R",
        color="Navy",
        brand="J.Crew",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=navy%20blazer",
    ),
    Item(
        name="Black Interview Suit",
        category="Men's Formal",
        size="40R",
        color="Black",
        brand="Calvin Klein",
        status="available",
        image_url="/placeholder.svg?height=400&width=300&query=interview%20suit",
    ),
    
    # Accessories
    Item(
        name="Silk Navy Tie",
        category="Accessories",
        size="One Size",
        color="Navy",
        brand="Hugo Boss",
        status="available",
        image_url="/fashion-accessories-ties-scarves-bags.jpg",
    ),
    Item(
        name="Leather Formal Belt",
        category="Accessories",
        size="M",
        color="Black",
        brand="Coach",
        status="available",
        image_url="/fashion-accessories-ties-scarves-bags.jpg",
    ),
    Item(
        name="Pearl Necklace",
        category="Accessories",
        size="One Size",
        color="White",
        brand="Classic",
        status="available",
        image_url="/fashion-accessories-ties-scarves-bags.jpg",
    ),
    Item(
        name="Black Leather Portfolio",
        category="Accessories",
        size="One Size",
        color="Black",
        brand="Tumi",
        status="available",
        image_url="/fashion-accessories-ties-scarves-bags.jpg",
    ),
    Item(
        name="Classic Watch",
        category="Accessories",
        size="Adjustable",
        color="Silver",
        brand="Timex",
        status="available",
        image_url="/fashion-accessories-ties-scarves-bags.jpg",
    ),
]

for item in items:
    session.add(item)
session.commit()
print(f"✅ Created {len(items)} items")

# ---------- Create Requests ----------
print("Creating requests...")
# Get some members and items for creating requests
member1 = session.query(Member).filter(Member.name == "Alice Chen").first()
member2 = session.query(Member).filter(Member.name == "Bob Smith").first()
item1 = session.query(Item).filter(Item.name == "Black A-Line Dress").first()
item2 = session.query(Item).filter(Item.name == "Navy Classic Suit").first()
item3 = session.query(Item).filter(Item.name == "Silk Navy Tie").first()

requests = [
    Request(
        member_id=member1.member_id,
        item_id=item1.item_id,
        status="pending",
        request_date=date.today() - timedelta(days=2),
        start_date=date.today() + timedelta(days=1),
        end_date=date.today() + timedelta(days=5),
        purpose="Job interview at consulting firm",
    ),
    Request(
        member_id=member2.member_id,
        item_id=item2.item_id,
        status="pending",
        request_date=date.today() - timedelta(days=1),
        start_date=date.today() + timedelta(days=3),
        end_date=date.today() + timedelta(days=7),
        purpose="Networking event",
    ),
    Request(
        member_id=member1.member_id,
        item_id=item3.item_id,
        status="approved",
        request_date=date.today() - timedelta(days=5),
        start_date=date.today() - timedelta(days=4),
        end_date=date.today() + timedelta(days=2),
        purpose="Formal presentation",
    ),
]

for req in requests:
    session.add(req)
session.commit()
print(f"✅ Created {len(requests)} requests")

# ---------- Create Rentals ----------
print("Creating rentals...")
# Get rented items
rented_item1 = session.query(Item).filter(Item.name == "Gray Blazer").first()
rented_item2 = session.query(Item).filter(Item.name == "Gray 3-Piece Suit").first()

rentals = [
    Rental(
        item_id=rented_item1.item_id,
        member_id=member1.member_id,
        checkout_date=date.today() - timedelta(days=7),
        expected_return_date=date.today() + timedelta(days=3),
        status="checked_out",
    ),
    Rental(
        item_id=rented_item2.item_id,
        member_id=member2.member_id,
        checkout_date=date.today() - timedelta(days=10),
        expected_return_date=date.today() + timedelta(days=4),
        status="checked_out",
    ),
]

for rental in rentals:
    session.add(rental)
session.commit()
print(f"✅ Created {len(rentals)} rentals")

print("\n🎉 Database seeded successfully!")
print(f"Total members: {session.query(Member).count()}")
print(f"Total items: {session.query(Item).count()}")
print(f"Total requests: {session.query(Request).count()}")
print(f"Total rentals: {session.query(Rental).count()}")

session.close()

