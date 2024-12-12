import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();




const JWT_SECRET = process.env.JWT_SECRET ;

// Signup API
export const addEmployee = async (req: Request, res: Response):Promise<void> => {
  
    const { name } = req.body;
    try {
      const newEmployee = await prisma.employee.create({
        data: { name },
      });
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: "Error adding employee", details: error });
    }
  }