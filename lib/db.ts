import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = "mongodb+srv://vaugheu:tempA@cluster0.yfpgp8o.mongodb.net/erp-system?retryWrites=true&w=majority&appName=Cluster0"

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db("erp-system")

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
