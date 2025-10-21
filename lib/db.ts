import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri =
    process.env.MONGODB_URI ||
    "mongodb+srv://vaugheu:tempA@cluster0.yfpgp8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db("erp_system")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function connectDB() {
  const { db } = await connectToDatabase()
  return db
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}
