// Initialize Database with Schema
// Run this script to set up your database tables
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  console.log('🚀 Initializing database...\n');
  
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

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database\n');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Executing schema...');
    await pool.query(schema);
    console.log('✅ Schema executed successfully\n');

    // Check tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('📋 Created tables:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    console.log('\n🎉 Database initialized successfully!');
    console.log('\n📌 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000/signup');
    console.log('   3. Create an admin user (see instructions below)\n');

    console.log('👤 To create an admin user:');
    console.log('   1. Sign up normally at /signup');
    console.log('   2. Then run this SQL in your database:');
    console.log('      UPDATE users SET role = \'admin\' WHERE email = \'your-email@example.com\';\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR: Database initialization failed!\n');
    console.error('Error message:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   1. Make sure PostgreSQL service is running');
    console.error('   2. Check your password in .env.local');
    console.error('   3. Make sure the database exists (create it in pgAdmin)');
    console.error('   4. Verify host, port, and username are correct\n');
    
    await pool.end();
    process.exit(1);
  }
}

initDatabase();


