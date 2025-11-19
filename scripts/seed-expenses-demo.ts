/**
 * Seed demo expenses data for testing the finances page
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedExpenses() {
  console.log('🌱 Starting expenses seed...\n');

  try {
    // 1. Get a property with members
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id')
      .limit(1)
      .single();

    if (propError || !properties) {
      console.error('❌ No properties found. Please create a property first.');
      return;
    }

    const propertyId = properties.id;
    console.log(`✅ Found property: ${propertyId}`);

    // 2. Get users in this property
    const { data: members, error: membersError } = await supabase
      .from('property_members')
      .select('user_id')
      .eq('property_id', propertyId);

    if (membersError || !members || members.length === 0) {
      console.error('❌ No members found in property. Please add members first.');
      return;
    }

    const userIds = members.map(m => m.user_id);
    console.log(`✅ Found ${userIds.length} members in property\n`);

    // 3. Delete existing demo expenses for this property
    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('property_id', propertyId);

    if (deleteError) {
      console.log('⚠️  Could not delete existing expenses:', deleteError.message);
    } else {
      console.log('🗑️  Cleared existing expenses\n');
    }

    // 4. Create demo expenses
    const demoExpenses = [
      {
        property_id: propertyId,
        created_by: userIds[0],
        paid_by_id: userIds[0],
        title: 'Courses de la semaine',
        description: 'Supermarché Carrefour - fruits, légumes, et produits de base',
        amount: 85.50,
        category: 'groceries',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        status: 'paid',
        split_type: 'equal'
      },
      {
        property_id: propertyId,
        created_by: userIds[1] || userIds[0],
        paid_by_id: userIds[1] || userIds[0],
        title: 'Facture Internet',
        description: 'Abonnement mensuel Fibre Orange',
        amount: 29.99,
        category: 'internet',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
        status: 'paid',
        split_type: 'equal'
      },
      {
        property_id: propertyId,
        created_by: userIds[0],
        paid_by_id: userIds[0],
        title: 'Produits ménagers',
        description: 'Lessive, liquide vaisselle, éponges',
        amount: 32.40,
        category: 'cleaning',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
        status: 'paid',
        split_type: 'equal'
      },
      {
        property_id: propertyId,
        created_by: userIds[1] || userIds[0],
        paid_by_id: userIds[1] || userIds[0],
        title: 'Électricité',
        description: 'Facture EDF du mois dernier',
        amount: 68.75,
        category: 'utilities',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
        status: 'paid',
        split_type: 'equal'
      },
      {
        property_id: propertyId,
        created_by: userIds[0],
        paid_by_id: userIds[0],
        title: 'Pizza party',
        description: 'Soirée entre colocs',
        amount: 45.00,
        category: 'groceries',
        date: new Date().toISOString().split('T')[0], // Today
        status: 'pending',
        split_type: 'equal'
      }
    ];

    const { data: insertedExpenses, error: insertError } = await supabase
      .from('expenses')
      .insert(demoExpenses)
      .select();

    if (insertError) {
      console.error('❌ Error inserting expenses:', insertError);
      return;
    }

    console.log(`✅ Created ${insertedExpenses.length} expenses\n`);

    // 5. Create expense splits for each expense
    for (const expense of insertedExpenses) {
      const splitAmount = expense.amount / userIds.length;

      const splits = userIds.map(userId => ({
        expense_id: expense.id,
        user_id: userId,
        amount_owed: Number(splitAmount.toFixed(2)),
        paid: expense.paid_by_id === userId, // Person who paid has already paid their share
        paid_at: expense.paid_by_id === userId ? new Date().toISOString() : null
      }));

      const { error: splitError } = await supabase
        .from('expense_splits')
        .insert(splits);

      if (splitError) {
        console.error(`❌ Error creating splits for expense ${expense.title}:`, splitError);
      } else {
        console.log(`✅ Created splits for: ${expense.title} (€${splitAmount.toFixed(2)} each)`);
      }
    }

    console.log('\n🎉 Expenses seeding completed successfully!');
    console.log(`📊 Total: ${insertedExpenses.length} expenses with ${userIds.length} people per split\n`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedExpenses();
