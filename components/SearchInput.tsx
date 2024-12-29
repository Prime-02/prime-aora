import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

type SearchInputProps = {
  initialQuery?: string; // Optional prop for the initial query
};

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery = "" }) => {
  const router = useRouter(); // useRouter hook for navigation
  const [query, setQuery] = useState(initialQuery);
  const handleSearch = () => {
    if (query.trim() === "") {
      Alert.alert(
        "Missing Query",
        "Please input something to search results across the database"
      );
      return;
    }

    // Navigate to the dynamic route /[query]/query
    router.push(`/query/${query}`);
  };

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={setQuery}
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
