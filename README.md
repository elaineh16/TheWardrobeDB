# Cornell Wardrobe Management System

A full-stack web application for managing The Wardrobe club's clothing rental operations. This system replaces multiple manual Google Sheets with a centralized platform that tracks inventory, manages rental requests, and updates item availability in real time.

## 🎯 Features

- **Browse Catalog**: Students can browse clothing by category, size, color, and brand
- **Request System**: Submit rental requests with custom dates and optional purpose
- **Inventory Management**: Staff dashboard to approve requests, log returns, and maintain inventory
- **Real-time Updates**: Item availability updates automatically as items are checked out or returned
- **Clean UI**: Modern, e-commerce-style interface built with Next.js and shadcn/ui

## 🏗️ Architecture

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (can be migrated to PostgreSQL)
- **ORM**: SQLAlchemy
- **Models**: Items, Members, Requests, Rentals, Logs

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Type Safety**: TypeScript

## 📁 Project Structure

```
wardrobeDB/
├── wardrobe-backend/
│   ├── api.py              # FastAPI application with all routes
│   ├── models.py           # SQLAlchemy database models
│   ├── setup_db.py         # Database initialization script
│   ├── seed_db.py          # Sample data seeding script
│   ├── requirements.txt    # Python dependencies
│   └── wardrobe.db         # SQLite database (generated)
│
├── wardrobe-frontend2/
│   ├── app/
│   │   ├── page.tsx        # Homepage
│   │   ├── catalog/        # Browse catalog
│   │   ├── requests/       # View requests
│   │   ├── admin/          # Admin dashboard
│   │   └── item/[id]/      # Item detail pages
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   └── package.json        # Node dependencies
│
├── wardrobe-frontend/      # Legacy reference frontend
│   └── ...                 # (kept for historical comparison)
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- pnpm (or npm/yarn)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd wardrobe-backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
python setup_db.py
```

5. Seed with sample data:
```bash
python seed_db.py
```

6. Start the development server:
```bash
uvicorn api:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API documentation.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd wardrobe-frontend2
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Create a `.env.local` file pointing to the backend:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

## 🎮 Usage

### For Students

1. **Browse Catalog**: Visit the homepage and click "Browse Collection" or navigate to `/catalog`
2. **Filter Items**: Use the filters on the left to narrow down by category, size, color, brand, or availability
3. **View Details**: Click on any item to see more information
4. **Request Rental**: Click "Request to Borrow" on an available item, select dates, and submit
5. **Track Requests**: Navigate to "My Requests" to see the status of your requests

### For Staff

1. **Admin Dashboard**: Navigate to `/admin` (requires staff role)
2. **Approve Requests**: View pending requests and approve or reject them
3. **Manage Inventory**: Update item statuses and view all items
4. **Track Rentals**: Monitor active rentals and mark items as returned

## 🔌 API Endpoints

### Items
- `GET /items` - Get all items (with optional filters)
- `GET /items/{id}` - Get a single item
- `POST /items` - Add a new item
- `PATCH /items/{id}` - Update an item
- `PATCH /items/{id}/status` - Update item status

### Requests
- `GET /requests` - Get all requests
- `GET /requests/{id}` - Get a single request
- `POST /requests` - Create a new request
- `PATCH /requests/{id}` - Update a request status

### Rentals
- `GET /rentals` - Get all rentals
- `POST /rentals` - Check out an item
- `PATCH /rentals/{id}/return` - Return an item

### Admin
- `GET /admin/overview` - Get dashboard statistics

## 🗄️ Database Schema

### Members
- `member_id` (PK): Unique identifier
- `name`: Member name
- `email`: Email address (unique)
- `role`: "borrower" or "staff"

### Items
- `item_id` (PK): Unique identifier
- `name`: Item name
- `category`: Category (e.g., "Men's Formal")
- `size`: Size
- `color`: Color
- `brand`: Brand name
- `status`: "available", "rented", "repair", or "retired"
- `image_url`: URL to item image

### Requests
- `request_id` (PK): Unique identifier
- `member_id` (FK): Reference to members
- `item_id` (FK): Reference to items
- `request_date`: Date of request
- `status`: "pending", "approved", or "rejected"

### Rentals
- `rental_id` (PK): Unique identifier
- `item_id` (FK): Reference to items
- `member_id` (FK): Reference to members
- `checkout_date`: Checkout date
- `expected_return_date`: Expected return date
- `actual_return_date`: Actual return date
- `status`: "checked_out", "returned", or "overdue"

### Logs
- `log_id` (PK): Unique identifier
- `item_id` (FK): Reference to items
- `user_id` (FK): Reference to members
- `timestamp`: Action timestamp
- `action`: Description of action

## 🔒 Authentication & Authorization

Currently, the system uses placeholder authentication. In production, you should:
1. Implement proper user authentication (e.g., OAuth, JWT)
2. Add role-based access control for admin pages
3. Secure API endpoints with authentication middleware
4. Add rate limiting and input validation

## 🧪 Testing

### Test the API

You can test the API using the interactive docs at `http://localhost:8000/docs`, or use curl:

```bash
# Get all items
curl http://localhost:8000/items

# Get a specific item
curl http://localhost:8000/items/1

# Get all requests
curl http://localhost:8000/requests

# Get admin overview
curl http://localhost:8000/admin/overview
```

### Test the Frontend

Simply navigate through the UI:
1. Browse the catalog
2. Filter items
3. View item details
4. Submit a request
5. Check the admin dashboard

## 📝 Sample Data

The seed script creates:
- 6 members (4 borrowers, 2 staff)
- 15 items (Women's Formal, Men's Formal, Accessories)
- 3 requests (2 pending, 1 approved)
- 2 active rentals

## 🚧 Future Enhancements

- [ ] Implement user authentication
- [ ] Add email notifications for requests and approvals
- [ ] Add image upload functionality
- [ ] Create advanced search and filtering
- [ ] Add analytics and reporting features
- [ ] Migrate to PostgreSQL for production
- [ ] Add item condition tracking
- [ ] Implement barcode scanning for checkout

## 🤝 Contributing

This is a project for Cornell Wardrobe club. For questions or suggestions, please contact the development team.

## 📄 License

This project is for use by Cornell Wardrobe club only.

## 👥 Acknowledgments

Built with:
- FastAPI
- Next.js
- SQLAlchemy
- shadcn/ui
- Tailwind CSS

