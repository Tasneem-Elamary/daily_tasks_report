import cors from 'cors';
import express,{ NextFunction, Request, Response } from 'express';;
import dotenv from 'dotenv'; // To load environment variables
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";
import employeeRouter from './route/employee.route';
import taskRouter from './route/task.route';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    export interface Request {
      io?: Server;
    }
  }
}




// Load environment variables
dotenv.config();

console.log('PORT:', process.env.PORT);

const app = express();
app.use(express.json());
app.use(cors());

// Create the HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://client:5173", // Adjust to match your frontend URL
    methods: ["GET", "POST","PUT","DELETE"],
  },
  allowEIO3: true,
});


app.use((req: Request, res: Response, next:NextFunction) => {
  req.io  = io; 
  next();
});
// Base URL for APIs
const baseUrl = '/api/v1';

// Define routes
app.use(`${baseUrl}/employee`, employeeRouter);
app.use(`${baseUrl}/task`, taskRouter);


// Start the server
// async function startServer() {
//   try {
//     await prisma.$connect();
//     console.log("Database connected successfully!");

//     // Define routes here

//     server.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     process.exit(1);
//   }
// }

// startServer();

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});