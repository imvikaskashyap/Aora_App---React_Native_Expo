import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.vk.aora",
  projectId: "6700d916001dc0cd9ae6",
  databaseId: "6700db7f00079f9c9d55",
  userCollectionId: "6700dbae0015988b97be",
  videoCollectionId: "6700dbf20037efb96e07",
  storageId: "6700dec5002ed0ff41c9",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);

    throw new Error(error);
  }
};


// Login User
export async function signIn(email, password) {
    try {
      // Check if a session already exists
      const currentUser = await account.get();
      
      // If a session exists, just return the session
      if (currentUser) {
        console.log("User already logged in:", currentUser);
        return currentUser;
      }
    } catch (error) {
      // If no session exists, error will be thrown. Proceed to sign in.
      console.log("No active session, proceeding to login...");
    }
  
    try {
      // Create a new session if no session is active
      const session = await account.createEmailPasswordSession(email, password);
      console.log("New session created:", session);
      return session;
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error(error.message);
    }
  }


export const getCurrentUser = async ()=>{
    try {

        const currentAccount = await account.get()

        if(!currentAccount) throw Error;

        const currentUser = await databases.getDocument(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0]
        
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}