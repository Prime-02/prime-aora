import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "676aafe5000377919366",
  databaseId: "676ab26e000419d75262",
  userCollectionId: "676d7885000edca05c81",
  videoCollectionId: "676d78c6001c35f410d8",
  storageId: "676ab6c9000644863913",
};

// Initialize your Appwrite client
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId); // Your project ID

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

// Define TypeScript types
type CreateUserResponse = {
  accountId: string;
  email: string;
  username: string;
  avatar: string;
};

type Session = {
  $id: string;
  userId: string;
  expire: string;
};

// Create a new user
export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<CreateUserResponse> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Failed to create an account");
    }

    const avatarUrl = avatar.getInitials(username);

    // Sign the user in to create a session
    await signIn(email, password);

    // Create a document for the user in the database
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl.href,
      }
    );

    return newUser ;
  } catch (error: any) {
    console.error("Error in createUser:", error.message);
    throw new Error(error.message);
  }
};

// Sign in a user
export const signIn = async (
  email: string,
  password: string
): Promise<Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session as Session;
  } catch (error: any) {
    console.error("Error in signIn:", error.message);
    throw new Error(error.message);
  }
};
