'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { parseStringify } from "../utils"

// server actions are Post actions, some people say u can't make a request form them, but u can. 

export const signIn = async ({email, password}: signInProps) => {
  try {
    // Mutation, Modified the Database, sometimes make a fetch
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    return parseStringify(response)

  } catch (error) {
    console.error('Error', error)
  }
}


export const signUp = async (userData: SignUpParams) => {
  const { firstName, lastName, email, password, address1, city, state, postalCode, dateOfBirth, ssn } = userData;

  try {
    // create a user account
     const { account } = await createAdminClient();

     //results in a new user account
    const newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount)

  } catch (error) {
    console.error('Error', error)
  }
}

// ... your initilization functions

// this return a promise so when we call it we need to use async await
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);  
  } catch (error) {
    return null;  
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();
    cookies().delete('appwrite-session')

    await account.deleteSession('current')

  } catch(error) {
    return null

  }
}
