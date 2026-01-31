import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkOwnerData() {
  const userId = '0fae7f94-49ff-477e-86eb-4d4742d1c616';

  console.log('🔍 Vérification des données pour baudonsamuel@gmail.com\n');

  // 1. Properties
  const { data: props, error: propsErr } = await supabase
    .from('properties')
    .select('id, title, city, monthly_rent, status')
    .eq('owner_id', userId);

  console.log('🏠 PROPRIÉTÉS:', props ? props.length : 0);
  if (propsErr) console.log('   Erreur:', propsErr.message);
  if (props) {
    props.forEach(p => console.log(`   • ${p.title} (${p.city}) - ${p.monthly_rent}€ [${p.status}]`));
  }

  if (!props || props.length === 0) {
    console.log('\n❌ Aucune propriété trouvée pour cet utilisateur!');
    return;
  }

  const propIds = props.map(p => p.id);

  // 2. Residents
  const { data: residents, error: resErr } = await supabase
    .from('property_residents')
    .select('id, property_id, first_name, last_name, move_in_date')
    .in('property_id', propIds);

  console.log('\n👥 RÉSIDENTS:', residents ? residents.length : 0);
  if (resErr) console.log('   Erreur:', resErr.message);
  if (residents) {
    residents.forEach(r => console.log(`   • ${r.first_name} ${r.last_name} (emménagé: ${r.move_in_date})`));
  }

  // 3. Rent Payments
  const { data: payments, count: paymentCount, error: payErr } = await supabase
    .from('rent_payments')
    .select('*', { count: 'exact' })
    .in('property_id', propIds)
    .limit(5);

  console.log('\n💰 PAIEMENTS DE LOYER:', paymentCount || 0);
  if (payErr) console.log('   Erreur:', payErr.message);
  if (payments && payments.length > 0) {
    console.log('   5 derniers:');
    payments.forEach(p => console.log(`   • ${p.month} - ${p.amount}€ [${p.status}]`));
  }

  // 4. Maintenance Requests
  const { data: tickets, error: ticketErr } = await supabase
    .from('maintenance_requests')
    .select('id, title, status, priority')
    .in('property_id', propIds);

  console.log('\n🔧 TICKETS MAINTENANCE:', tickets ? tickets.length : 0);
  if (ticketErr) console.log('   Erreur:', ticketErr.message);

  if (tickets) {
    const byStatus: Record<string, number> = {};
    tickets.forEach(t => { byStatus[t.status] = (byStatus[t.status] || 0) + 1; });
    console.log('   Par statut:', byStatus);
  }

  // Summary
  console.log('\n════════════════════════════════════════');
  console.log('📊 RÉSUMÉ:');
  console.log(`   • ${props.length} propriétés`);
  console.log(`   • ${residents ? residents.length : 0} résidents`);
  console.log(`   • ${paymentCount || 0} paiements`);
  console.log(`   • ${tickets ? tickets.length : 0} tickets maintenance`);

  const resCount = residents ? residents.length : 0;
  const ticketCount = tickets ? tickets.length : 0;

  if (resCount > 0 && ticketCount > 0) {
    console.log('\n✅ Les données mockup sont présentes!');
    console.log('   Tu devrais les voir sur /dashboard/owner/gestion');
  } else {
    console.log('\n⚠️  Données partiellement présentes');
  }
}

checkOwnerData();
