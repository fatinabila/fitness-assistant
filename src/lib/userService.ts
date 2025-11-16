import { supabase } from './supabase';

interface UserData {
  authId: string;
  email: string;
  name?: string;
  image?: string;
}

export async function upsertUser(userData: UserData) {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        auth_id: userData.authId,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'auth_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting user:', error);
    throw error;
  }

  return data;
}

export async function getUserByAuthId(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data;
}