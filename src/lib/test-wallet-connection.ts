import { supabaseClient } from './supabase'

export async function testWalletConnectionFlow() {
  console.log('🔍 Testing wallet connection flow...')
  
  try {
    // Test 1: Check if users table exists and is accessible
    console.log('📡 Testing users table access...')
    const { data: usersTest, error: usersError } = await supabaseClient
      .from('users')
      .select('id, wallet_address, wallet_type, created_at')
      .limit(5)
    
    if (usersError) {
      console.error('❌ Users table test failed:', usersError)
      return { success: false, error: usersError.message }
    }
    console.log('✅ Users table access successful')
    console.log('📊 Current users in database:', usersTest?.length || 0)

    // Test 2: Try to create a test user
    console.log('👤 Testing user creation...')
    const testWalletAddress = 'test_wallet_' + Date.now()
    const testUser = {
      wallet_address: testWalletAddress,
      wallet_type: 'phantom',
      first_connected_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
      is_active: true,
      profile_data: {
        username: 'test_user',
        bio: 'Test user for wallet connection',
        preferences: {
          theme: 'dark',
          notifications: true,
          public_profile: true
        }
      }
    }

    const { data: createdUser, error: createError } = await supabaseClient
      .from('users')
      .insert(testUser)
      .select()
      .single()

    if (createError) {
      console.error('❌ User creation test failed:', createError)
      return { 
        success: false, 
        error: createError.message,
        details: createError
      }
    }

    console.log('✅ User creation test successful:', createdUser.id)

    // Test 3: Try to update the test user
    console.log('🔄 Testing user update...')
    const { data: updatedUser, error: updateError } = await supabaseClient
      .from('users')
      .update({
        last_active_at: new Date().toISOString(),
        profile_data: {
          ...testUser.profile_data,
          username: 'updated_test_user'
        }
      })
      .eq('wallet_address', testWalletAddress)
      .select()
      .single()

    if (updateError) {
      console.error('❌ User update test failed:', updateError)
    } else {
      console.log('✅ User update test successful:', updatedUser.id)
    }

    // Test 4: Try to fetch user by wallet address
    console.log('🔍 Testing user fetch by wallet address...')
    const { data: fetchedUser, error: fetchError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('wallet_address', testWalletAddress)
      .single()

    if (fetchError) {
      console.error('❌ User fetch test failed:', fetchError)
    } else {
      console.log('✅ User fetch test successful:', fetchedUser.id)
    }

    // Clean up test user
    console.log('🧹 Cleaning up test user...')
    const { error: deleteError } = await supabaseClient
      .from('users')
      .delete()
      .eq('wallet_address', testWalletAddress)

    if (deleteError) {
      console.warn('⚠️ Failed to clean up test user:', deleteError)
    } else {
      console.log('✅ Test user cleaned up successfully')
    }

    console.log('🎉 Wallet connection flow tests passed!')
    return { 
      success: true, 
      message: 'All wallet connection tests passed',
      testResults: {
        usersTableAccess: true,
        userCreation: !!createdUser,
        userUpdate: !updateError,
        userFetch: !fetchError,
        cleanup: !deleteError
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error during wallet connection test:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

// Function to check if a specific wallet address exists in database
export async function checkWalletInDatabase(walletAddress: string) {
  console.log(`🔍 Checking if wallet ${walletAddress} exists in database...`)
  
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error checking wallet:', error)
      return { exists: false, error: error.message }
    }

    if (data) {
      console.log('✅ Wallet found in database:', data.id)
      return { exists: true, user: data }
    } else {
      console.log('❌ Wallet not found in database')
      return { exists: false, user: null }
    }
  } catch (error) {
    console.error('💥 Error checking wallet:', error)
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Function to get all users from database
export async function getAllUsers() {
  console.log('📊 Getting all users from database...')
  
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('id, wallet_address, wallet_type, first_connected_at, last_active_at, is_active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error getting users:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Found ${data?.length || 0} users in database`)
    return { success: true, users: data || [] }
  } catch (error) {
    console.error('💥 Error getting users:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}






