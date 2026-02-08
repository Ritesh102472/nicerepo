# 📬 Postman Collection Guide

This guide explains how to use the **Cosmic Watch API Postman Collection** to test all backend endpoints.

---

## 📥 Installation

### Step 1: Import the Collection

1. **Download** the collection file:
   - File: `Cosmic-Watch-API.postman_collection.json`
   - Location: Root directory of the project

2. **Open Postman**
   - Download from [postman.com](https://www.postman.com/downloads/)
   - Create a free account if needed

3. **Import the Collection**
   - Click **Import** or use `Ctrl+O` / `Cmd+O`
   - Select the `Cosmic-Watch-API.postman_collection.json` file
   - Click **Import**

### Step 2: Set Environment Variables

The collection uses a variable `{{token}}` for JWT authentication.

**Option A: Set Token Manually**
1. In Postman, go to **Variables** tab
2. Find the `token` variable
3. Paste your JWT token after login

**Option B: Use Tests (Automatic)**
1. After login, Postman automatically extracts and stores the token
2. The token is saved to the `token` variable
3. Other requests automatically use this token

---

## 🚀 Getting Started

### Prerequisite: Ensure Backend is Running

```bash
# In project root
docker-compose -f docker-compose.mongo.yml up -d
cd backend && npm run dev
# Backend should be running on http://localhost:5001
```

### Test Flow

Follow these steps in order:

#### 1️⃣ **Sign Up** (Create Account)
```
POST /api/user/signup
```
- **Body**: Provide `name`, `email`, `password`
- **Response**: Get JWT token
- **Save**: Copy the token to the `token` variable

#### 2️⃣ **Login** (Get Token)
```
POST /api/user/login
```
- **Body**: Provide `email`, `password`
- **Response**: Get JWT token
- **Save**: Copy token or let Postman auto-save

#### 3️⃣ **Get Current User** (Verify Authentication)
```
GET /api/user/me
```
- **Header**: Uses `Bearer {{token}}`
- **Response**: Returns current user profile
- **Purpose**: Verify token is valid

#### 4️⃣ **Get Asteroid Feed** (View Available Asteroids)
```
GET /api/feed?page=0&size=20
```
- **Query Params**: 
  - `page`: Page number (0-based)
  - `size`: Items per page
  - `start_date`: Optional (YYYY-MM-DD)
  - `end_date`: Optional (YYYY-MM-DD)
- **Response**: List of Near-Earth Objects
- **Purpose**: Browse asteroids

#### 5️⃣ **Get Feed Stats** (View Statistics)
```
GET /api/stats
```
- **Response**: Total NEO count and hazardous count
- **Purpose**: Get overview statistics

#### 6️⃣ **Lookup Asteroid by ID** (Detailed Info)
```
GET /api/neo/2000433
```
- **Path Param**: Asteroid ID (e.g., 2000433 for Eros)
- **Response**: Detailed asteroid information
- **Purpose**: Get detailed data for specific asteroid

#### 7️⃣ **Search Asteroids** (Find by Name)
```
GET /api/neo/search?q=Eros&limit=10
```
- **Query Params**:
  - `q`: Search query
  - `limit`: Max results
- **Response**: Matching asteroids
- **Purpose**: Search asteroids by name

#### 8️⃣ **Get Watchlist** (Your Saved Asteroids)
```
GET /api/watchlist
```
- **Response**: All asteroids in your watchlist
- **Purpose**: View saved asteroids

#### 9️⃣ **Add to Watchlist** (Save Asteroid)
```
POST /api/watchlist
```
- **Body**: 
  ```json
  {
    "asteroidId": "2000433",
    "asteroidName": "Eros",
    "asteroidData": { /* full asteroid object */ },
    "notes": "Optional notes"
  }
  ```
- **Response**: Created watchlist item
- **Purpose**: Save asteroid for tracking

#### 🔟 **Remove from Watchlist** (Delete Saved Asteroid)
```
DELETE /api/watchlist/:id
```
- **Path Param**: Watchlist item ID (from get watchlist)
- **Response**: Success message
- **Purpose**: Remove asteroid from watchlist

#### 1️⃣1️⃣ **Health Check** (Verify Server)
```
GET /health
```
- **No Auth Required**
- **Response**: Server status
- **Purpose**: Verify backend is running

---

## 🔐 Authentication

### JWT Token Management

**What is a JWT Token?**
- A secure way to authenticate API requests
- Expires after a certain time (typically 7 days)
- Must be included in the `Authorization` header

**How to Use Tokens in Postman**

1. **After Login/Signup**, copy the token from response:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIs..."
   }
   ```

2. **Set it in Postman Variables**:
   - Tab: **Variables**
   - Variable: `token`
   - Value: Paste the token

3. **Headers are Auto-Set**:
   - All protected endpoints use: `Authorization: Bearer {{token}}`
   - Postman automatically replaces `{{token}}` with your actual token

**Test Token Validity**
```
GET /api/user/me
```
If it returns 401 Unauthorized, your token has expired. Get a new one by logging in again.

---

## 📊 Common Use Cases

### Use Case 1: Create Account & Explore Asteroids

```
1. Sign Up
   → Get token

2. Get Feed
   → View available asteroids

3. Lookup Specific Asteroid
   → Get detailed info

4. Add to Watchlist
   → Save interesting asteroids
```

### Use Case 2: Track Multiple Asteroids

```
1. Login
   → Get token

2. Search for "Eros"
   → Find asteroid by name

3. Get details on Eros
   → Review orbital data

4. Add to Watchlist (with notes)
   → Save for tracking

5. Search for "Albert"
   → Find another asteroid

6. Add to Watchlist
   → Save second asteroid

7. Get Watchlist
   → View both saved asteroids
```

### Use Case 3: Clean Up Watchlist

```
1. Login
   → Get token

2. Get Watchlist
   → View all saved asteroids

3. Remove from Watchlist [:id]
   → Delete unwanted items

4. Get Watchlist again
   → Verify deletion
```

---

## 🧪 Testing Tips

### Test Different Date Ranges

Modify the `/api/feed` endpoint:
```
GET /api/feed?page=0&size=20&start_date=2026-01-01&end_date=2026-03-31
```

Change dates to filter asteroids approaching on specific dates.

### Test Pagination

```
# First page
GET /api/feed?page=0&size=20

# Next page
GET /api/feed?page=1&size=20

# Load more
GET /api/feed?page=2&size=20
```

### Test Search with Different Queries

```
# Search exact
GET /api/neo/search?q=Eros&limit=10

# Search partial
GET /api/neo/search?q=Alb&limit=5

# Search with limit
GET /api/neo/search?q=Apollo&limit=20
```

### Test Watchlist Operations

```
# Add multiple asteroids
POST /api/watchlist  (repeat with different ID)

# Verify they're all there
GET /api/watchlist

# Remove one
DELETE /api/watchlist/:id

# Confirm removal
GET /api/watchlist
```

---

## 🐛 Troubleshooting

### Problem: 401 Unauthorized

**Cause**: Invalid or expired token

**Solution**:
1. Go to Login endpoint
2. Send your credentials
3. Copy new token
4. Update `token` variable in Postman
5. Retry request

### Problem: 404 Not Found

**Cause**: Invalid endpoint or asteroid ID

**Solution**:
1. Check endpoint path spelling
2. Verify asteroid ID exists
3. Confirm base URL is `http://localhost:5001`

### Problem: MongoDB Connection Error

**Cause**: Database not running

**Solution**:
```bash
# Start MongoDB
docker-compose -f docker-compose.mongo.yml up -d

# Wait 10 seconds, then retry
```

### Problem: CORS Error

**Cause**: Cross-origin request blocked

**Solution**:
1. Ensure backend is running
2. Check `CORS_ORIGIN` in backend `.env`
3. Restart backend: `npm run dev`

### Problem: Request Body Issues

**Cause**: Missing or malformed JSON

**Solution**:
1. Click **Body** tab
2. Select **raw** and **JSON**
3. Ensure valid JSON syntax
4. Check all required fields are included

---

## 📱 API Response Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 304 | Not Modified | No changes since last request |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Backend error |

---

## 🔗 Quick Links

- **Backend URL**: `http://localhost:5001`
- **Health Check**: `http://localhost:5001/health`
- **API Base**: `http://localhost:5001/api`
- **NASA NEO Data**: Based on [NASA API](https://api.nasa.gov)

---

## 📚 Additional Resources

- **Main README**: [../README.md](../README.md)
- **Backend Docs**: [../backend/README.md](../backend/README.md)
- **AI Log**: [../AI-LOG.md](../AI-LOG.md)
- **Postman Docs**: [postman.com/docs](https://learning.postman.com)

---

## ✅ Checklist for First-Time Setup

- [ ] Backend running on port 5001
- [ ] MongoDB connected
- [ ] Postman installed
- [ ] Collection imported
- [ ] Tested `/health` endpoint
- [ ] Created account (Sign Up)
- [ ] Logged in (Login)
- [ ] Verified token saved
- [ ] Retrieved current user (Get Me)
- [ ] Viewed feed
- [ ] Tested searchfunction
- [ ] Added to watchlist
- [ ] Retrieved watchlist
- [ ] Deleted from watchlist

---

**Happy Testing! 🚀 All endpoints are documented and ready to use.**

*Last Updated: February 8, 2026*
