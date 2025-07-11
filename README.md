# Kneefiy Todo App

A collaborative Todo application built with Next.js, React, and Supabase. This app allows users to create, manage, share, and collaborate on todos.

## Features

- **User Authentication**: Secure authentication via Supabase Auth
- **Todo Management**: Create, update, and delete todos
- **Collaboration**: Share todos with other users with permission controls
- **Due Dates**: Set and track due dates for your todos
- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Updates**: Changes reflect immediately across shared users

## Key Components

### Todo Management

- Create and manage personal todos
- Mark todos as complete/incomplete
- Set due dates with visual indicators for overdue tasks
- Delete unwanted todos

### Collaboration Features

- Share todos with other users via email
- Control access permissions (read-only or read-write)
- View shared todos alongside personal ones
- See who has access to your todos

### User Interface

- Clean, responsive design built with Tailwind CSS
- Intuitive modal interfaces for sharing and setting due dates
- Detailed view for todo information and collaboration settings

## Technical Architecture

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase for authentication and database
- **State Management**: React Context API and custom hooks
- **Authentication**: Supabase Auth with cookie-based sessions

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/context` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and Supabase client
- `/services` - API service classes
- `/types` - TypeScript type definitions

## Getting Started

### Prerequisites

- Node.js (v22 or newer)
- npm or yarn
- Supabase account and project

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yusufnuru/kneefiy-todo
   cd kneefiy-todo
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Create a `.env.local` file with your Supabase credentials

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server

   ```bash
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following Supabase tables:

### todos

This table stores the core todo items created by users.

| Column      | Type        | Description                                  |
| ----------- | ----------- | -------------------------------------------- |
| id          | uuid        | Primary key. Unique identifier for the todo. |
| user_id     | uuid        | The ID of the user who created the todo.     |
| content     | text        | Main content of the todo item.               |
| created_at  | timestamp   | When the todo was created.                   |
| completed   | bool        | Whether the task is completed.               |
| description | text        | Optional longer description.                 |
| updated_at  | timestamptz | Last time the todo was updated.              |
| due_date    | timestamptz | Optional due date for the task.              |

### todo_shares

This table handles the sharing of todos between users.

| Column            | Type        | Description                                |
| ----------------- | ----------- | ------------------------------------------ |
| id                | uuid        | Primary key. Unique share entry ID.        |
| todo_id           | uuid        | Foreign key referencing the shared todo.   |
| shared_with_email | text        | Email of the user the todo is shared with. |
| permission        | text        | Permission level (e.g. read_only, edit).   |
| created_at        | timestamptz | When the share was created.                |
| owner_email       | text        | Email of the original owner of the todo.   |

#### Relationships

- `todo_shares.todo_id` → references `todos.id`

Each todo can be shared with multiple users, allowing collaborative task management.

## License

MIT License
