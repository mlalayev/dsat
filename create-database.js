// Script to create the database if it doesn't exist
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function createDatabase() {
  console.log('🔍 Checking database connection...\n');
  
  // First, connect to default 'postgres' database to create our database
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres', // Connect to default database first
  });

  const dbName = process.env.DB_NAME || 'preppulse_db';

  try {
    console.log(`📊 Trying to create database: ${dbName}\n`);
    
    // Check if database exists
    const checkResult = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkResult.rows.length > 0) {
      console.log(`✅ Database "${dbName}" already exists!\n`);
    } else {
      // Create the database
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Successfully created database "${dbName}"!\n`);
    }

    await adminPool.end();

    // Now test connection to the new database
    console.log('🔍 Testing connection to the database...\n');
    const testPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: dbName,
    });

    const result = await testPool.query('SELECT NOW() as current_time');
    console.log('✅ SUCCESS! Database connection works!\n');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log('\n🎉 Everything is ready! You can now use your database.\n');
    
    await testPool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR!\n');
    console.error('Error message:', error.message);
    console.error('\n💡 This usually means:');
    console.error('   1. PostgreSQL service is not running');
    console.error('   2. Wrong password in .env.local');
    console.error('   3. Wrong host/port/username');
    console.error('   4. You don\'t have permission to create databases\n');
    
    await adminPool.end();
    process.exit(1);
  }
}

createDatabase();


