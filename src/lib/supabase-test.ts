import { supabaseClient } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabaseClient
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('Supabase connection test successful')
    return {
      success: true,
      message: 'Connection successful'
    }
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

export async function testMemeTableAccess() {
  try {
    console.log('Testing memes table access...')
    
    // Test if we can access memes table
    const { data, error } = await supabaseClient
      .from('memes')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Memes table access test failed:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('Memes table access test successful')
    return {
      success: true,
      message: 'Table access successful'
    }
  } catch (error) {
    console.error('Memes table access test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

export async function testUserTableAccess() {
  try {
    console.log('Testing users table access...')
    
    // Test if we can access users table
    const { data, error } = await supabaseClient
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Users table access test failed:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('Users table access test successful')
    return {
      success: true,
      message: 'Table access successful'
    }
  } catch (error) {
    console.error('Users table access test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

export async function runAllTests() {
  console.log('Running all Supabase tests...')
  
  const connectionTest = await testSupabaseConnection()
  const userTableTest = await testUserTableAccess()
  const memeTableTest = await testMemeTableAccess()
  
  const results = {
    connection: connectionTest,
    userTable: userTableTest,
    memeTable: memeTableTest,
    allPassed: connectionTest.success && userTableTest.success && memeTableTest.success
  }
  
  console.log('All tests completed:', results)
  return results
}






