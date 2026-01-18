// Create Admin User Script
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'preppulse_db',
  });

  try {
    console.log('🔐 Creating admin user...\n');

    const email = 'admin@example.com';
    const password = 'admin123';
    const name = 'Admin User';

    // Check if admin already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existing.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Email:', email);
      console.log('   ID:', existing.rows[0].id);
      console.log('\n💡 To make an existing user admin, run:');
      console.log(`   UPDATE users SET role = 'admin' WHERE email = 'their-email@example.com';\n`);
      await pool.end();
      process.exit(0);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create admin user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, name, email, role`,
      [name, email, password_hash]
    );

    const admin = result.rows[0];

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Admin Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role:', admin.role);
    console.log('   ID:', admin.id);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('🌐 Login at: http://localhost:3000/login\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createAdmin();


