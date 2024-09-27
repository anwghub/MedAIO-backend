import express from 'express';
import dotenv from 'dotenv';
//mport { connectDB } from './backend/db/connectDB';
import authRoutes from './backend/routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/",(req, res)=>{
   res.send("Hello World123!"); 
})

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(PORT, () =>{
    //connectDB();
    console.log("Server is running on port: ", PORT);
})