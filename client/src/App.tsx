// import {
//       BrowserRouter as Router,
//       Route,
//       Routes,

//     } from 'react-router-dom';
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import React, { FormEvent } from "react";

import { io } from "socket.io-client";



const apiUrl = import.meta.env.VITE_BASE_URL;

console.log(apiUrl)

const socket = io("http://server:3000/");

// Define a type for the Task
interface Task {
  id: number;
  description: string;
  assignedTo: string;
  from: string;
  to: string;
  employee: { name: string }
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [showFilterMetrics, setShowFilterMetrics] = useState(false);



  useEffect(() => {

    const fetchTasks = async () => {
      const response = await fetch(`${apiUrl}/task`);
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
    // Listen for "task-added" events from the server
    socket.on("task-added", (newTask) => {
      console.log("New task received:", newTask);
      setTasks((prevTasks) => [...prevTasks, newTask]); // Add the new task to the state
    });

    socket.on("task-updated", (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    });

    // Listen for task-deleted event
    socket.on("task-deleted", (deletedTask) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deletedTask.id)
      );
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("task-added");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, []);

  const handleAddTask = () => {
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskData = {
      description: formData.get("description"),
      employeeName: formData.get("assignedTo"),
      from: formData.get("from"),
      to: formData.get("to"),
    };

    console.log(taskData)

    try {
      if (selectedTask) {
        // Send a PUT request to update the existing task
        const response = await fetch(`${apiUrl}/task/${selectedTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        const updatedTask = await response.json();
        console.log("Task updated successfully:", updatedTask);
      } else {
        // Send a POST request to create a new task
        const response = await fetch(`${apiUrl}/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error message from the backend
          alert(errorData.error); // Throw the error message received from the backend
        }

        const newTask = await response.json();
        console.log("Task created successfully:", newTask);
      }

      // Optionally refresh tasks or reset the form
      e.target.reset();
    } catch (error: any) {
      console.error(error.message);
    }


    setDialogOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Task Manager</h1>
        <div className="flex items-center space-x-4">
          {showFilterMetrics && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Total Hours: {tasks.reduce((sum, task) => {
                  const duration = (new Date(task.to).getTime() - new Date(task.from).getTime()) / (1000 * 60 * 60);
                  return sum + duration;
                }, 0).toFixed(2)} hrs
              </h3>
              <h3 className="text-lg font-semibold text-gray-600">
                Remaining Hours: {(8 - tasks.reduce((sum, task) => {
                  const duration = (new Date(task.to).getTime() - new Date(task.from).getTime()) / (1000 * 60 * 60);
                  return sum + duration;
                }, 0)).toFixed(2)} hrs
              </h3>
            </div>
          )}
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleAddTask}>
            Add Task
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setFilterDialogOpen(true)}>
            Filter
          </Button>
        </div>
      </div>
      {/* Task Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead>Task ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => handleEditTask(task)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.employee?.name}</TableCell>
                <TableCell>{new Date(task.from).toISOString().slice(0, 16)}</TableCell>
                <TableCell>{new Date(task.to).toISOString().slice(0, 16)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Edit Task" : "Add Task"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTask} className="space-y-4">
            <Input
              name="description"
              placeholder="Task Description"
              defaultValue={selectedTask?.description || ""}
              required
            />
            <Input
              name="assignedTo"
              placeholder="Assigned To"
              defaultValue={selectedTask?.employee.name || ""}
              required
            />
            <Input
              name="from"
              type="datetime-local"
              defaultValue={
                selectedTask?.from
                  ? new Date(selectedTask.from).toISOString().slice(0, 16) // Format as "YYYY-MM-DDTHH:mm"
                  : ""
              }
              required
            />
            <Input
              name="to"
              type="datetime-local"
              defaultValue={
                selectedTask?.to
                  ? new Date(selectedTask.to).toISOString().slice(0, 16) // Format as "YYYY-MM-DDTHH:mm"
                  : ""
              }
              required
            />
            <DialogFooter>
              <Button type="submit" variant="default">
                Save Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const filterDate = formData.get("date") as string;
              const filterEmployee = formData.get("employee") as string;

              const filteredTasks = tasks.filter(
                (task) =>
                  (!filterDate || task.from.includes(filterDate)) &&
                  (!filterEmployee || task.assignedTo.includes(filterEmployee))
              );

              console.log("Filtered Tasks:", filteredTasks);
              setTasks(filteredTasks)
              setShowFilterMetrics(true);
              setFilterDialogOpen(false);
            }}
            className="space-y-4"
          >
            <Input name="date" type="date" placeholder="Filter by Date" />
            <Input name="employee" placeholder="Filter by Employee" />
            <DialogFooter>
              <Button type="submit" variant="default">
                Apply Filters
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
