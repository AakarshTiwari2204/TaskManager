import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuth } from "@/lib/auth/middleware";

// PUT update task
export const PUT = withAuth(async (req, context, userId) => {
  try {
    const { id } = context.params;
    const { title, description, dueDate, completed, status } = await req.json();

    // Verify task belongs to authenticated user
    const existingTask = await db.task.findFirst({
      where: { 
        id, 
        userId 
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Update task
    const updatedTask = await db.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existingTask.title,
        description: description !== undefined ? (description?.trim() || null) : existingTask.description,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTask.dueDate,
        completed: completed !== undefined ? completed : existingTask.completed,
        status: status !== undefined ? status : existingTask.status
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
});

// DELETE task
export const DELETE = withAuth(async (req, context, userId) => {
  try {
    const { id } = context.params;

    // Verify task belongs to authenticated user
    const existingTask = await db.task.findFirst({
      where: { 
        id, 
        userId 
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Delete task
    await db.task.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
});