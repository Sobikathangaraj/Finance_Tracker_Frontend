## Tech Stack : 

- **Framework** - React (Vite)
- **Routing** - React Router DOM
- **HTTP Client** - Axios
- **Styling** - Inline CSS (no external library)

## Live Demo :  https://financetrackerdeploy.netlify.app/

---

## Project Structure

```
frontend/
── src/
    ── api.js
    ── App.jsx
    ── index.css
    ── main.jsx
    ── components/
│         ── Layout.jsx
    ── pages/
          ── Login.jsx
          ── Dashboard.jsx
          ── Transactions.jsx
          ── Users.jsx
```

## How It Works

**api.js** handles all backend communication. It attaches the JWT token automatically to every request using an Axios interceptor:

```javascript
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})
```

once logged in, every API call is automatically authenticated without manually adding the token each time.

---

## Pages and Features

**Login Page**
- User enters email and password
- On success, token and user info are stored in localStorage
- Redirected to dashboard automatically

**Dashboard Page**
- Shows total income, total expenses and net balance
- Shows category wise spending totals
- Shows recent 5 transactions (Pagination)
- Accessible based on roles — Admin, Analyst, Viewer

**Transactions Page**
- Shows all transactions in a table with pagination
- Admin can add new transactions using the form
- Admin can delete transactions
- Filter by type — income or expense
- Search by notes keyword
- Pagination — 5 records per page with Prev and Next buttons
- Accessible to Admin and Analyst only

**Users Page**
- Shows all registered users
- Admin can update any user's role by clicking the role badge
- Admin can activate or deactivate users
- Admin can delete users
- Accessible to Admin only

---

## Role Based Action : 

**Admin** sees Dashboard, Transactions and Users in sidebar.

**Analyst** sees Dashboard and Transactions only. No add or delete buttons shown.

**Viewer** sees Dashboard only. Transactions and Users are hidden from sidebar.

This is handled in `Layout.jsx` and each page component checks `user.role` from localStorage before rendering action buttons.

---

## Authentication Flow

1. User logs in via `/auth/login`
2. Token saved to `localStorage`
3. Every API request includes token via Axios interceptor
4. On logout, localStorage is cleared and user is redirected to login
5. Protected routes redirect to login if no token found

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@finance.com | password123 |
| Analyst | analyst@finance.com | password123 |
| Viewer | viewer@finance.com | password123 |
```

## How to Run Locally

```bash
git clone https://github.com/yourusername/finance-tracker-frontend.git
cd frontend
npm install
npm run dev
```
---



