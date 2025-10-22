/**
 * MongoDB Connection Checker
 * Run with: node scripts/check-mongodb.js
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-system'

async function checkMongoDB() {
  console.log('🔍 Checking MongoDB connection...\n')
  console.log(`Connection String: ${MONGODB_URI}\n`)

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })

  try {
    console.log('⏳ Attempting to connect...')
    await client.connect()
    console.log('✅ Successfully connected to MongoDB!\n')

    const db = client.db()
    const collections = await db.listCollections().toArray()
    
    console.log('📊 Database Information:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Database Name: ${db.databaseName}`)
    console.log(`Collections: ${collections.length}`)
    
    if (collections.length > 0) {
      console.log('\n📁 Existing Collections:')
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments()
        console.log(`  - ${collection.name}: ${count} documents`)
      }
    } else {
      console.log('\n📁 No collections found (database is empty)')
    }
    
    console.log('\n✨ MongoDB is ready to use!')
    console.log('\n💡 Next steps:')
    console.log('   1. Run: npm run seed')
    console.log('   2. Run: npm run dev')
    console.log('   3. Login at http://localhost:3000')
    
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB\n')
    console.log('Error Details:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Error: ${error.message}\n`)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🔧 Troubleshooting Steps:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('\n1. MongoDB is not running. Start it with:')
      console.log('   Windows:  net start MongoDB')
      console.log('   macOS:    brew services start mongodb-community')
      console.log('   Linux:    sudo systemctl start mongod')
      console.log('   Docker:   docker start mongodb')
      console.log('\n2. Or use MongoDB Atlas (cloud):')
      console.log('   - Sign up at https://www.mongodb.com/cloud/atlas')
      console.log('   - Create a free cluster')
      console.log('   - Get connection string')
      console.log('   - Update MONGODB_URI in .env file')
      console.log('\n3. Check if MongoDB is installed:')
      console.log('   - Run: mongosh')
      console.log('   - If not found, install MongoDB')
      console.log('\n📖 See MONGODB_SETUP.md for detailed instructions')
    } else if (error.message.includes('authentication')) {
      console.log('🔧 Authentication Issue:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('Check your MongoDB credentials in .env file')
      console.log('Make sure username and password are correct')
    } else if (error.message.includes('timeout')) {
      console.log('🔧 Connection Timeout:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('1. Check if MongoDB is running')
      console.log('2. Check firewall settings')
      console.log('3. Verify connection string is correct')
    }
    
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Run the check
checkMongoDB()
