# QnA Discussion Forum

A collaborative question-and-answer platform where users can post questions, answer others, vote on responses, and leave comments. Built using the latest modern stack including **Next.js App Router**, **Prisma**, and **PostgreSQL**.

---

## 🎥 Demo Video

Watch the full demo vide on folder:  
👉 https://drive.google.com/drive/folders/119GMa6yx4L2CXeGj0V_AvsEnLTfSGoCA?usp=sharing

---

## 👥 Team — Team Pheonix 🔥

| Name         | Email                        | Role        |
|--------------|------------------------------|-------------|
| Kishan       | kishanpatel7705@gmail.com    | Developer   |
| Uday         | pu9052473@gmail.com          | Developer   |
| Nilax Modi   | nilax.pln@gmail.com          | Developer   |
| Mohak Shah   | shahonthefloor@gmail.com     | Team Leader |

---

## 🚀 Features

- 🔐 Custom authentication (Email/Password) with Google Login
- ✍️ Rich text editor (Tiptap) for questions, answers, and comments
- ❓ Post and edit questions
- ✅ Post and edit answers
- 💬 Add, edit, and delete comments
- 👍 Upvote / 👎 Downvote answers (One vote per user)
- ⏳ Timestamps with edited indicator
- 🔍 Clean and responsive UI

---

## 🛠 Tech Stack

| Layer     | Technology                      |
|----------|----------------------------------|
| Frontend | Next.js 14 (App Router), React   |
| Styling  | Tailwind CSS                     |
| Backend  | Next.js API Routes (App Router)  |
| Database | PostgreSQL                       |
| ORM      | Prisma                           |
| Auth     | Custom Login + Google OAuth      |
| Editor   | Tiptap (Rich text editor)        |
| State    | React Query                      |

---

## 🔐 Authentication

The platform supports:
- ✅ Custom Signup/Login using email & password
- ✅ Google OAuth Login using Google accounts

Users can securely register or sign in using their preferred method.

---

## 🧑‍💻 Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/qna-discussion-forum.git
cd qna-discussion-forum

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Database connection string
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Supabase credentials (used for file uploads or public services if any)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# UploadThing token (for file/image upload service)
UPLOADTHING_TOKEN=your-uploadthing-token

# Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth secret for securing JWT sessions
NEXTAUTH_SECRET=your-nextauth-secret

# 4. Push Prisma schema to database
npx prisma db push

# 5. Run the development server
npm run dev

