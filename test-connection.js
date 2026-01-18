// Simple script to test your PostgreSQL connection
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'preppulse_db',
  });

  try {
    console.log('📊 Connection details:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || '5432'}`);
    console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'preppulse_db'}\n`);

    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ SUCCESS! Database connection works!\n');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
    console.log('\n🎉 Everything is set up correctly!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR: Connection failed!\n');
    console.error('Error message:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   1. Make sure PostgreSQL service is running');
    console.error('   2. Check your password in .env.local');
    console.error('   3. Make sure the database "preppulse_db" exists');
    console.error('   4. Verify host, port, and username are correct\n');
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();


