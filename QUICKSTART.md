# Quick Start Guide

Get the Cornell Wardrobe Management System up and running in 5 minutes!

## Prerequisites
- Python 3.9+
- Node.js 18+
- pnpm (or npm/yarn)

## Setup Steps

### 1. Backend Setup (Terminal 1)

```bash
cd wardrobe-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize and seed database
python setup_db.py
python seed_db.py

# Start the server
uvicorn api:app --reload --port 8000
```

✅ Backend running at http://localhost:8000

### 2. Frontend Setup (Terminal 2)

```bash
cd wardrobe-frontend2

# Install dependencies
pnpm install  # or npm install / yarn install

# Configure API base URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
pnpm dev  # or npm run dev / yarn dev
```

✅ Frontend running at http://localhost:3000

## First Steps

1. **Browse the Catalog**: Visit http://localhost:3000/catalog
2. **View Admin Dashboard**: Visit http://localhost:3000/admin
3. **API Documentation**: Visit http://localhost:8000/docs

## Sample Data

The seed script creates:
- 6 members (4 borrowers, 2 staff)
- 15 clothing items (Women's Formal, Men's Formal, Accessories)
- 3 requests (2 pending, 1 approved)
- 2 active rentals

## Test Credentials

For testing purposes:
- Staff members: `es_staff@cornell.edu`, `fa_admin@cornell.edu`
- Borrowers: `ac123@cornell.edu`, `bs456@cornell.edu`, etc.

## Troubleshooting

### Backend not starting?
```bash
# Make sure you're in the virtual environment
source venv/bin/activate  # Windows: venv\Scripts\activate

# Check if port 8000 is already in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend not starting?
```bash
# Clear node modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### SQLAlchemy/Python 3.13 compatibility error?
```bash
# If you see AssertionError related to SQLCoreOperations, upgrade SQLAlchemy
pip install --upgrade 'sqlalchemy>=2.0.36'

# Or reinstall all dependencies
pip install -r requirements.txt --upgrade
```

### Database issues?
```bash
# Delete the database and reinitialize
rm wardrobe.db
python setup_db.py
python seed_db.py
```

## Next Steps

- Browse the full [README.md](README.md) for detailed documentation
- Check out the API docs at http://localhost:8000/docs
- Explore the codebase structure

Enjoy managing The Wardrobe! 🎉

