const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  console.log('🚀 Starting Database Initialization for CertifyHub...');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  let connection;
  try {
    console.log(`📡 Connecting to MySQL server at ${dbConfig.host}:${dbConfig.port} as '${dbConfig.user}'...`);
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server successfully.');

    // 1. Run Schema
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Executing database schema creation (schema.sql)...');
    await connection.query(schemaSql);
    console.log('✅ Database schema and 10 tables created successfully.');

    // 2. Run Seed
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      throw new Error(`seed.sql not found at ${seedPath}`);
    }
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('🌱 Populating initial seed data (users, courses, quizzes, certs)...');
    await connection.query(seedSql);
    console.log('✅ Seed data successfully imported!');

    console.log('\n🎉 Database setup complete! Summary:');
    console.log('   - Admin: admin@example.com (Password: Admin@123)');
    console.log('   - Student: student@example.com (Password: Student@123)');
    console.log('   - Courses: 5 published courses with modules, lessons, & quizzes');
    console.log('   - Sample Certificate: CERT-2026-000101 (Verification code: VERIFY-PY-89472)\n');
  } catch (error) {
    console.error('\n❌ Database initialization error:');
    console.error(error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔑 Please verify DB_USER and DB_PASSWORD in your server/.env file.');
      console.error('   Default in .env is user=root, password=root. Edit if your local MySQL has a different password.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
