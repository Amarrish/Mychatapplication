import path from "path";
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';  
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import './DB/connection.js';
import { server, app } from './Socket/socket.js';
// const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser()); 

const __dirname = path.resolve();
// Serve frontend static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.use(userRoutes);

// Catch-all route to serve frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


const PORT = 5000;
server.listen(PORT, () => {
  console.log('Listening on port', PORT);
});



