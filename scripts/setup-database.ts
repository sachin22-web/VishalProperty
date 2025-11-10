import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fizofutsqztwitlwjzqv.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  try {
    console.log('Starting database setup...\n');

    // Create admin user
    console.log('Creating admin user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@vishalproperties.com',
      password: 'Admin@123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError.message);
      // Continue even if user exists
    } else if (authData.user) {
      console.log('✓ Admin user created:', authData.user.email);

      // Create profile for admin user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: 'Admin User',
        });

      if (profileError) {
        console.error('Error creating profile:', profileError.message);
      } else {
        console.log('✓ Admin profile created');
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'admin',
        });

      if (roleError) {
        console.error('Error assigning role:', roleError.message);
      } else {
        console.log('✓ Admin role assigned');
      }
    }

    // Verify properties exist
    const { count: propertyCount, error: propError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (propError) {
      console.error('Error checking properties:', propError.message);
    } else {
      console.log(`✓ Properties in database: ${propertyCount || 0}`);
    }

    // Verify leads exist
    const { count: leadCount, error: leadError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (leadError) {
      console.error('Error checking leads:', leadError.message);
    } else {
      console.log(`✓ Leads in database: ${leadCount || 0}`);
    }

    console.log('\n✓ Database setup completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@vishalproperties.com');
    console.log('Password: Admin@123456');

  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
