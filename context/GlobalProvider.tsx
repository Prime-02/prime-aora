import { getCurrentUser } from "@/lib/appwrite";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the context type
interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any; // Replace `any` with the type of your user object if available
  setUser: React.Dispatch<React.SetStateAction<any>>; // Replace `any` if user type is defined
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a default context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to use the GlobalContext
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Props for the GlobalProvider component
interface GlobalProviderProps {
  children: ReactNode;
}

// GlobalProvider component
const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null); // Replace `any` with the type of your user object if available
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res) {
        setIsLoggedIn(true);
        setUser(res);
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    })
    .catch((error) =>{
        console.log(error);
    })
    .finally(()=>{
        setIsLoading(false)
    })
    // console.log(user);
    
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
