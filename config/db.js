import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  const { MONGO_URI } = process.env

  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in the environment variables.")
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

const setupConnectionListeners = () => {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB")
  })

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err)
  })

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from DB")
  })
}

const handleGracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close()
    console.log(`MongoDB connection closed due to ${signal}`)
    process.exit(0)
  } catch (error) {
    console.error("Error during graceful shutdown:", error)
    process.exit(1)
  }
}

process.on("SIGINT", () => handleGracefulShutdown("app termination"))
process.on("SIGTERM", () => handleGracefulShutdown("app termination"))

setupConnectionListeners()

export default connectDB