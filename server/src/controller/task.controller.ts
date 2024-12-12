import { PrismaClient } from '@prisma/client';

import { NextFunction, Request, Response } from 'express';
import { startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export const addTask = async (req: Request, res: Response): Promise <any> =>{
  const { employeeName, description, from, to } = req.body;

  try {
    // Convert `from` and `to` to Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Extract the date (without time) from the `from` field
    const taskDate = fromDate.toISOString().split("T")[0]; // Example: "2024-12-10"

    const employee = await prisma.employee.findFirstOrThrow({
      where: { name: employeeName },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Fetch all tasks for the employee for the same date
    const tasksForDay = await prisma.task.findMany({
      where: {
        employeeId:employee.id,
        from: {
          gte: new Date(`${taskDate}T00:00:00`), // Start of the day
        },
        to: {
          lte: new Date(`${taskDate}T23:59:59`), // End of the day
        },
      },
    });

    

    // Calculate total hours already allocated for the day
    const totalHours = tasksForDay.reduce((sum, task) => {
      const duration =
        (new Date(task.to).getTime() - new Date(task.from).getTime()) / (1000 * 60 * 60);
      return sum + duration;
    }, 0);

    console.log(totalHours)

    // Calculate duration of the new task
    const newTaskDuration = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60);

    console.log(newTaskDuration)

    // Check if the new task exceeds the daily limit of 8 hours
    if (totalHours + newTaskDuration > 8) {
       return res.status(400).json({ error: "Task exceeds daily limit of 8 hours" });
    }
    console.log(fromDate)
    // Create the new task
    const newTask = await prisma.task.create({
      data: {
        employeeId:employee.id,
        description,
        from: fromDate,
        to: toDate,
      },
    });
    const taskWithEmployee = {
      ...newTask,
      employee: {
        name: employee.name, // Adjust the fields as per your employee schema
      },
    };
    
    // Emit the task with the employee details
    req.io?.emit("task-added", taskWithEmployee);


   

    res.status(201).json(newTask);
  } catch (error:any) {
    res.status(500).json({ error: "Error adding task", details: error.message });
  }
};


export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { employee: true },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks", details: error });
  }
}

export const updateTask = async (req: Request, res: Response):Promise <any>  => {
  const { id } = req.params; // Task ID
  const { description, from, to } = req.body;

  try {
    // Convert `from` and `to` to Date objects
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { employee: true },
    });

    if (!existingTask) {
       return res.status(404).json({ error: "Task not found" });
    }

    // Use provided values or fall back to the current values
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        description: description ?? existingTask?.description,
        from: from ? new Date(from) : existingTask?.from,
        to: to ? new Date(to) : existingTask?.to,
      },
    });

    const updatedTaskWithEmployee = {
      ...updatedTask,
      employee: {
        name: existingTask.employee.name, // Adjust the fields as per your employee schema
      },
    };

    // Emit socket event to notify clients about the update
    req.io?.emit("task-updated", updatedTaskWithEmployee);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task", details: error });
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params; // Task ID

  try {
    // Delete task from the database
    const deletedTask = await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    // Emit socket event to notify clients about the deletion
    req.io?.emit("task-deleted", deletedTask);

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task", details: error });
  }
};



export const dailysummary= async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date } = req.query; // Pass date as a query parameter (e.g., ?date=2024-10-15)

  try {
    const tasksForDay = await prisma.task.findMany({
      where: { employeeId: parseInt(id, 10) },
    });

    const totalHours = tasksForDay.reduce((sum, task) => {
      const duration = (new Date(task.to).getTime() - new Date(task.from).getTime()) / (1000 * 60 * 60);
      return sum + duration;
    }, 0);

    res.json({
      totalHours,
      remainingHours: 8 - totalHours,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching summary", details: error });
  }
}