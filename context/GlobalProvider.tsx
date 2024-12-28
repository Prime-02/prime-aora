// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { getCurrentUser } from "../lib/appwrite";

// // Define types for the user and context state
// interface User {
//   // Define the properties of the user object as per your requirements.
//   // For example:
//   id: string;
//   email: string;
//   name: string;
// }

// interface GlobalContextType {
//   isLogged: boolean;
//   setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
//   loading: boolean;
// }

// const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// export const useGlobalContext = (): GlobalContextType => {
//   const context = useContext(GlobalContext);
//   if (!context) {
//     throw new Error("useGlobalContext must be used within a GlobalProvider");
//   }
//   return context;
// };

// interface GlobalProviderProps {
//   children: ReactNode;
// }

// const GlobalProvider = ({ children }: GlobalProviderProps) => {
//   const [isLogged, setIsLogged] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     getCurrentUser()
//       .then((res) => {
//         if (res) {
//           setIsLogged(true);
//           setUser(res); // assuming res is of type User
//         } else {
//           setIsLogged(false);
//           setUser(null);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <GlobalContext.Provider
//       value={{
//         isLogged,
//         setIsLogged,
//         user,
//         setUser,
//         loading,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export default GlobalProvider;
