from models import Base, create_engine, sessionmaker

# Create a new SQLite database file (can switch to PostgreSQL later)
engine = create_engine("sqlite:///wardrobe.db")

# Create all tables
Base.metadata.create_all(engine)

# Optional: create a session for testing
Session = sessionmaker(bind=engine)
session = Session()

print("✅ Database and tables created successfully!")
