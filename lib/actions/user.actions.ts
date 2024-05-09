'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "../plaid"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actons"

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env
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

  let newUserAccount;

  try {
    // create a user account
     const { account, database } = await createAdminClient();

     //results in a new user account
    newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if(!newUserAccount ) throw new Error('Error creating user')

    // only then create a dwolla(payment processor) customer Url
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal',
    })

    if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
    
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl) 
    
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }  
    )


    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser) // user comming directly from the database

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


export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ['auth'] as Products[], 
      language: 'en',
      country_codes: ['US']  as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({linkToken: response.data.link_token})

  } catch(error) {
    console.log(error)
  }
}

//strictly for appwrite as a document within our database
export const createBankAccount = async ({userId, accountId, bankId, fundingSourceUrl, sharableId,
  }: createBankAccountProps) => {
  try {
    const {database} = await createAdminClient()// appwrite client allowing us to make new documents

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId, accountId, bankId, fundingSourceUrl, sharableId
      },
    ) 


    return parseStringify(bankAccount)
   
  } catch (error) {
    console.error('Error', error)
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}
