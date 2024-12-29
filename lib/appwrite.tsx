import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "676aafe5000377919366",
  databaseId: "676ab26e000419d75262",
  userCollectionId: "676d7885000edca05c81",
  videoCollectionId: "676d78c6001c35f410d8",
  storageId: "676ab6c9000644863913",
};
const {
  endpoint,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

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
    await account.deleteSession(`current`);
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

    // Map the response to CreateUserResponse
    const response: CreateUserResponse = {
      accountId: newUser.accountId, // Ensure this field exists in the document
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar,
    };

    return response;
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

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal(`accountId`, currentAccount.$id)]
    );
    if (!currentUser) {
      throw Error;
    }
    return currentUser.documents[0];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

type Document = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Adjust if `$permissions` has a different structure (e.g., object or array of specific types)
};

type User = {
  username: string;
  avatar: string;
};

type Post = Document & {
  $id: string;
  users: User;
  title: string;
  description?: string;
  thumbnail: string;
  video: string;
  // Add any custom fields specific to your "Post" documents
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments<Post>(
      databaseId,
      videoCollectionId
    );
    return posts.documents;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred.");
  }
};

type LatestDocument = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Adjust if `$permissions` has a different structure
};

type LatestUser = {
  username: string;
  avatar: string;
};

type LatestPost = LatestDocument & {
  users: LatestUser;
  title: string;
  description?: string;
  thumbnail: string;
  video: string;
};

export const getLatestPosts = async (): Promise<LatestPost[]> => {
  try {
    // Correct the query syntax here by fixing the missing comma
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)] // Add a comma here and correctly structure the query
    );
    return posts.documents as LatestPost[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred.");
  }
};

type SearchDocument = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Adjust if `$permissions` has a different structure
};

type SearchUser = {
  username: string;
  avatar: string;
};

type SearchPost = SearchDocument & {
  users: SearchUser;
  title: string;
  description?: string;
  thumbnail: string;
  video: string;
};

export const getSearchPosts = async (query: string): Promise<SearchPost[]> => {
  try {
    // Correct the query syntax here by fixing the missing comma
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search("title", query)] // Add a comma here and correctly structure the query
    );
    return posts.documents as SearchPost[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred.");
  }
};

type UserDocument = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Adjust if `$permissions` has a different structure
};

type UserUser = {
  username: string;
  avatar: string;
};

type UserPost = UserDocument & {
  users: UserUser;
  title: string;
  description?: string;
  thumbnail: string;
  video: string;
};

export const getUserPosts = async (userId: string): Promise<UserPost[]> => {
  try {
    // Correct the query syntax here by fixing the missing comma
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("users", userId)] // Add a comma here and correctly structure the query
    );
    return posts.documents as UserPost[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};
