import {Account, Client, ID} from 'react-native-appwrite';
import { Platform } from "react-native";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.prime.aora",
  projectId: "676aafe5000377919366",
  datbaseId: "676ab26e000419d75262",
  userCollectionId: "676d7885000edca05c81",
  videoCollectionId: "676d78c6001c35f410d8",
  storageId: "676ab6c9000644863913",
};
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.
  
  const account = new Account(client);

   export const createUser = () => {
     account.create(ID.unique(), "me@example.com", "password", "Jane Doe").then(
       function (response) {
         console.log(response);
       },
       function (error) {
         console.log(error);
       }
     );
   };
