import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
