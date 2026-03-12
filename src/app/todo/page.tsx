"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Calendar,
  Clock,
  Target,
  Archive,
  Inbox,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  completed: boolean;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

type SidebarItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
};

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          fetchTasks();
        } else {
          router.push("/signin");
        }
      } catch (error) {
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        await fetchTasks();
        setNewTask({ title: "", description: "", dueDate: "" });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleEditTask = async () => {
    if (!editingTask || !editingTask.title.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          dueDate: editingTask.dueDate,
        }),
      });

      if (response.ok) {
        await fetchTasks();
        setIsEditDialogOpen(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleStatusChange = async (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      const completed = status === 'COMPLETED';
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, completed }),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory === "todo") return task.status === 'TODO';
    if (selectedCategory === "inprogress") return task.status === 'IN_PROGRESS';
    if (selectedCategory === "completed") return task.status === 'COMPLETED';
    if (selectedCategory === "today") {
      const today = new Date().toDateString();
      return task.dueDate && new Date(task.dueDate).toDateString() === today;
    }
    return true;
  });

  const sidebarItems: SidebarItem[] = [
    {
      id: "all",
      name: "All Tasks",
      icon: <Inbox className="w-5 h-5" />,
      count: tasks.length,
      color: "text-blue-600",
    },
    {
      id: "today",
      name: "Today",
      icon: <Calendar className="w-5 h-5" />,
      count: tasks.filter(task => {
        const today = new Date().toDateString();
        return task.dueDate && new Date(task.dueDate).toDateString() === today;
      }).length,
      color: "text-orange-600",
    },
    {
      id: "todo",
      name: "To Do",
      icon: <Circle className="w-5 h-5" />,
      count: tasks.filter(task => task.status === 'TODO').length,
      color: "text-gray-600",
    },
    {
      id: "inprogress",
      name: "In Progress",
      icon: <Play className="w-5 h-5" />,
      count: tasks.filter(task => task.status === 'IN_PROGRESS').length,
      color: "text-yellow-600",
    },
    {
      id: "completed",
      name: "Completed",
      icon: <CheckCircle2 className="w-5 h-5" />,
      count: tasks.filter(task => task.status === 'COMPLETED').length,
      color: "text-green-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gradient-to-r from-purple-500 to-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-medium"
          >
            Loading your tasks...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 text-sm">Manage your tasks efficiently</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 p-6"
        >
          <div className="space-y-6">
            {/* Add Task Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Task
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Add a new task to your list and stay organized
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="What needs to be done?"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add details (optional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddTask} 
                      disabled={!newTask.title.trim()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Create Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Separator />

            {/* Sidebar Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === item.id
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 shadow-sm"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={item.color}>
                      {item.icon}
                    </div>
                    <span className={`font-medium ${
                      selectedCategory === item.id ? "text-purple-700" : "text-gray-700"
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  <Badge 
                    variant={selectedCategory === item.id ? "default" : "secondary"}
                    className={
                      selectedCategory === item.id 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-200 text-gray-600"
                    }
                  >
                    {item.count}
                  </Badge>
                </motion.button>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(t => t.completed).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-orange-600">
                    {tasks.filter(t => !t.completed).length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` 
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {sidebarItems.find(item => item.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Task List */}
              <ScrollArea className="h-[calc(100%-80px)]">
                <div className="space-y-3 pr-4">
                  <AnimatePresence>
                    {filteredTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No tasks found
                        </h3>
                        <p className="text-gray-500">
                          {selectedCategory === "all"
                            ? "Create your first task to get started!"
                            : selectedCategory === "today"
                            ? "No tasks due today. Enjoy your day!"
                            : selectedCategory === "active"
                            ? "All caught up! Great job!"
                            : "No completed tasks yet."
                          }
                        </p>
                      </motion.div>
                    ) : (
                      filteredTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                        >
                          <Card className={`hover:shadow-md transition-all duration-200 ${
                            task.completed ? "bg-gray-50/80" : "bg-white/80"
                          } backdrop-blur-sm border border-gray-200/50`}>
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleToggleComplete(task.id, !task.completed)}
                                  className="mt-1"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                  )}
                                </motion.button>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className={`font-medium transition-all duration-200 ${
                                      task.completed 
                                        ? "line-through text-gray-500" 
                                        : "text-gray-900"
                                    }`}>
                                      {task.title}
                                    </h3>
                                    <Select
                                      value={task.status}
                                      onValueChange={(value) => handleStatusChange(task.id, value as 'TODO' | 'IN_PROGRESS' | 'COMPLETED')}
                                    >
                                      <SelectTrigger className="w-32 h-7 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="TODO">
                                          <div className="flex items-center">
                                            <Circle className="w-3 h-3 mr-2" />
                                            To Do
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="IN_PROGRESS">
                                          <div className="flex items-center">
                                            <Play className="w-3 h-3 mr-2" />
                                            In Progress
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                          <div className="flex items-center">
                                            <CheckCircle2 className="w-3 h-3 mr-2" />
                                            Completed
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {task.description && (
                                    <p className={`text-sm mt-1 ${
                                      task.completed 
                                        ? "text-gray-400" 
                                        : "text-gray-600"
                                    }`}>
                                      {task.description}
                                    </p>
                                  )}
                                  {task.dueDate && (
                                    <div className="mt-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          new Date(task.dueDate) < new Date() && !task.completed
                                            ? "border-red-200 text-red-600 bg-red-50"
                                            : "border-blue-200 text-blue-600 bg-blue-50"
                                        }`}
                                      >
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-1 ml-4">
                                  <Dialog
                                    open={isEditDialogOpen && editingTask?.id === task.id}
                                    onOpenChange={(open) => {
                                      setIsEditDialogOpen(open);
                                      if (!open) setEditingTask(null);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setEditingTask(task)}
                                          className="h-8 w-8 p-0 hover:bg-gray-100"
                                        >
                                          <Edit3 className="w-4 h-4 text-gray-500" />
                                        </Button>
                                      </motion.div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Edit Task</DialogTitle>
                                        <DialogDescription>
                                          Update your task details
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor="edit-title">Task Title *</Label>
                                          <Input
                                            id="edit-title"
                                            placeholder="What needs to be done?"
                                            value={editingTask?.title || ""}
                                            onChange={(e) =>
                                              setEditingTask(
                                                editingTask
                                                  ? { ...editingTask, title: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-description">Description</Label>
                                          <Textarea
                                            id="edit-description"
                                            placeholder="Add details (optional)"
                                            value={editingTask?.description || ""}
                                            onChange={(e) =>
                                              setEditingTask(
                                                editingTask
                                                  ? { ...editingTask, description: e.target.value }
                                                  : null
                                              )
                                            }
                                            rows={3}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-dueDate">Due Date</Label>
                                          <Input
                                            id="edit-dueDate"
                                            type="date"
                                            value={editingTask?.dueDate || ""}
                                            onChange={(e) =>
                                              setEditingTask(
                                                editingTask
                                                  ? { ...editingTask, dueDate: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                          <Button variant="outline" onClick={() => {
                                            setIsEditDialogOpen(false);
                                            setEditingTask(null);
                                          }}>
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleEditTask}
                                            disabled={!editingTask?.title.trim()}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                          >
                                            Save Changes
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </motion.div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete your task.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}