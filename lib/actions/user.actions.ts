'use server'
// server actions are Post actions, some people say u can't make a request form them, but u can. 

export const signIn = async () => {
  try {
    // Mutation, Modified the Database, sometimes make a fetch
  } catch (error) {
    console.error('Error', error)
  }
}


export const signUp = async ({userData}: SignUpParams) => {
  try {
    // create a user account
  } catch (error) {
    console.error('Error', error)
  }
}