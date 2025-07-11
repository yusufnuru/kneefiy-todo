import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Todo } from "@/types/todo";

export class TodoService {
  private supabase = createClient();
  private auth = useAuth();

  async getTodos(userId: string, userEmail?: string): Promise<Todo[]> {
    if (!userId) {
      throw new Error("No userId provided");
    }

    if (userEmail) {
      // Get owned todos and shared todos separately, then merge
      const [ownedResult, sharedResult] = await Promise.all([
        // Get owned todos
        this.supabase
          .from("todos")
          .select(
            `
              *,
              todo_shares(
                  shared_with_email,
                  permission
              )
            `
          )
          .eq("user_id", userId),

        // Get shared todos
        this.supabase
          .from("todos")
          .select(
            `
              *,
              todo_shares(
                  shared_with_email,
                  permission
              )
            `
          )
          .eq("todo_shares.shared_with_email", userEmail),
      ]);

      if (ownedResult.error) throw ownedResult.error;
      if (sharedResult.error) throw sharedResult.error;

      // Merge and deduplicate
      const todoMap = new Map();

      // Add owned todos
      ownedResult.data.forEach((todo) => {
        todoMap.set(todo.id, todo);
      });

      // Add shared todos (avoiding duplicates)
      sharedResult.data.forEach((todo) => {
        if (!todoMap.has(todo.id)) {
          todoMap.set(todo.id, todo);
        }
      });

      return Array.from(todoMap.values()).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      // Simple case: only owned todos
      const { data, error } = await this.supabase
        .from("todos")
        .select(
          `
            *,
            todo_shares(
                shared_with_email,
                permission
            )
          `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  }

  async getTodoById(todoId: string): Promise<Todo | null> {
    const { data, error } = await this.supabase
      .from("todos")
      .select(
        `
          *,
          todo_shares(
              shared_with_email,
              permission,
              created_at,
              owner_email
          )
        `
      )
      .eq("id", todoId)
      .single();

    if (error) throw error;
    return data;
  }

  async toggleTodoStatus(
    todoId: string,
    currentStatus: boolean
  ): Promise<void> {
    const { error } = await this.supabase
      .from("todos")
      .update({
        completed: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", todoId);

    if (error) throw error;
  }

  async updateDueDate(todoId: string, dueDate: string): Promise<void> {
    const { error } = await this.supabase
      .from("todos")
      .update({
        due_date: dueDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", todoId);

    if (error) throw error;
  }

  async deleteTodo(todoId: string): Promise<void> {
    // First delete shares
    await this.supabase.from("todo_shares").delete().eq("todo_id", todoId);

    // Then delete the todo
    const { error } = await this.supabase
      .from("todos")
      .delete()
      .eq("id", todoId);

    if (error) throw error;
  }

  async shareTodo(todoId: string, email: string): Promise<void> {
    // Check if already shared
    const { data: existing } = await this.supabase
      .from("todo_shares")
      .select("*")
      .eq("todo_id", todoId)
      .eq("shared_with_email", email)
      .single();

    if (existing) {
      throw new Error("Todo is already shared with this user");
    }

    if (!this.auth?.user) {
      throw new Error("User not authenticated");
    }
    const { error } = await this.supabase.from("todo_shares").insert({
      todo_id: todoId,
      shared_with_email: email,
      owner_email: this.auth.user.email,
      permission: "read_write",
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  async removeTodoShare(todoId: string, email: string): Promise<void> {
    const { error } = await this.supabase
      .from("todo_shares")
      .delete()
      .eq("todo_id", todoId)
      .eq("shared_with_email", email);

    if (error) throw error;
  }

  async updateSharePermission(
    todoId: string,
    email: string,
    permission: "read" | "read_write"
  ): Promise<void> {
    const { error } = await this.supabase
      .from("todo_shares")
      .update({ permission })
      .eq("todo_id", todoId)
      .eq("shared_with_email", email);

    if (error) throw error;
  }

  async createTodo(
    todo: Omit<Todo, "id" | "created_at" | "updated_at" | "todo_shares">
  ): Promise<Todo> {
    const { data, error } = await this.supabase
      .from("todos")
      .insert({
        ...todo,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
}
