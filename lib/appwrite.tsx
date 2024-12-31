import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
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
const storage = new Storage(client);
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
    // await account.deleteSession(`current`);
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
      videoCollectionId,
      [Query.orderDesc("$createdAt")] // Add a comma here and correctly structure the query
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
      [Query.orderDesc("$createdAt"), Query.equal("users", userId)] // Add a comma here and correctly structure the
      // query
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

type FileType = {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
};

// Define the form type used in CreateVideo
type CreateVideoForm = {
  video: FileType | null;
  thumbnail: FileType | null;
  title: string;
  prompt: string;
  userId: string;
};

// Refactored getFilePreview function to account for ImageGravity type
export const getFilePreview = async (
  fileId: string,
  type: "video" | "image"
): Promise<string> => {
  let fileUrl: URL | undefined;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      // Adjust the 'gravity' parameter to use a valid ImageGravity value
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      ); // 'center' as an example
    } else {
      if (!(fileUrl instanceof URL)) {
        throw new Error("Invalid file URL returned");
      }
    }

    if (!fileUrl) throw new Error("File URL not found");
    return fileUrl.toString(); // Ensure the URL is converted to a string
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "An unknown error occurred while fetching the file preview"
      );
    }
  }
};

// Refactor uploadFile with correct asset type
export const uploadFile = async (
  file: FileType | null,
  type: "video" | "image"
): Promise<string | undefined> => {
  if (!file) {
    return undefined;
  }

  // Ensure the file object has all required properties: name, size, uri
  const { mimeType, name, size, uri } = file;
  const asset = { name, type: mimeType, size, uri }; // Create the asset object with all required properties

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while uploading the file");
    }
  }
};

// Refactor CreateVideo function with proper typing
export const CreateVideo = async (form: CreateVideoForm): Promise<any> => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while creating the video");
    }
  }
};


export const AddToFav = async (
  fileId: string,
  userId: string,
  databaseId: string,
  videoCollectionId: string
): Promise<void> => {
  try {
    // Retrieve the document
    const document = await databases.getDocument(
      databaseId,
      videoCollectionId,
      fileId
    );

    // Update the document with the new `liked` array
    await databases.updateDocument(databaseId, videoCollectionId, fileId, {
      liked: userId,
    });
  } catch (error: any) {
    console.error("Error adding video to favorites:", error);
    throw new Error(error.message || "Unknown error occurred");
  }
};


type FavDocument = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Adjust if `$permissions` has a different structure
};

type favDocUser = {
  username: string;
  avatar: string;
};

type favPosts = FavDocument & {
  users: favDocUser;
  title: string;
  description?: string;
  thumbnail: string;
  video: string;
};

export const getfavPosts = async (userId: string): Promise<favPosts[]> => {
  try {
    // Correct the query syntax here by fixing the missing comma
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.equal("liked", userId)] // Add a comma here and correctly structure the
      // query
    );
    return posts.documents as favPosts[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred.");
  }
};