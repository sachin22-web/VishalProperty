#!/usr/bin/env node

// This script creates an admin user in Supabase
// Run with: node scripts/create-admin-user.js

const https = require('https');

const PROJECT_URL = 'https://fizofutsqztwitlwjzqv.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.error('Get it from: https://app.supabase.com/project/fizofutsqztwitlwjzqv/settings/api');
  process.exit(1);
}

async function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, PROJECT_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpem9mdXRzcXp0d2l0bHdqenF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjQyMTEsImV4cCI6MjA3Nzc0MDIxMX0.0XJdDvBlE6f_Gac5IyfTlUdSymsguKSBZp4WLtAmt9Y',
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(json)}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function createAdmin() {
  try {
    console.log('🔄 Creating admin user...\n');

    // Delete existing user if any
    console.log('📋 Checking for existing user...');
    try {
      const users = await makeRequest('GET', '/auth/v1/admin/users', null);
      const existingUser = users.users?.find(u => u.email === 'msingh63908@gmail.com');
      
      if (existingUser) {
        console.log('🗑️  Deleting existing user...');
        await makeRequest('DELETE', `/auth/v1/admin/users/${existingUser.id}`, null);
        console.log('✓ User deleted');
      }
    } catch (e) {
      console.log('⚠️  Could not list users (ignoring)');
    }

    // Create new user
    console.log('\n👤 Creating new admin user...');
    const userResponse = await makeRequest('POST', '/auth/v1/admin/users', {
      email: 'msingh63908@gmail.com',
      password: '1234567',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
      },
    });

    const userId = userResponse.id;
    console.log('✓ User created:', userResponse.email);
    console.log('  ID:', userId);

    // Create profile
    console.log('\n📝 Creating user profile...');
    await makeRequest('POST', '/rest/v1/profiles', {
      id: userId,
      email: 'msingh63908@gmail.com',
      full_name: 'Admin User',
    });
    console.log('✓ Profile created');

    // Assign admin role
    console.log('\n🔐 Assigning admin role...');
    await makeRequest('POST', '/rest/v1/user_roles', {
      user_id: userId,
      role: 'admin',
    });
    console.log('✓ Admin role assigned');

    console.log('\n✅ Admin user created successfully!\n');
    console.log('Login credentials:');
    console.log('  Email:    msingh63908@gmail.com');
    console.log('  Password: 1234567');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
