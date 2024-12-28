import { Alert } from "react-native";
import { useEffect, useState } from "react";

// Generic hook for fetching data
const useAppwrite = <T,>(fn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null); // Changed type to be nullable
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res); // Assign the response to the data state
    } catch (error) {
      Alert.alert("Error", (error as Error).message); // Type assertion to Error to access message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
