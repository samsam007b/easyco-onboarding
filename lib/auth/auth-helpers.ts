import { createClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return profile
}

export async function redirectToDashboard(userType?: string) {
  if (!userType) {
    const profile = await getUserProfile()
    userType = profile?.user_type
  }

  if (userType === 'searcher') {
    redirect('/dashboard/searcher')
  } else if (userType === 'owner') {
    redirect('/dashboard/owner')
  } else if (userType === 'resident') {
    redirect('/dashboard/resident')
  } else {
    redirect('/select-user-type')
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
