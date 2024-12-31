import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { EmptyState, SearchInput, VideoCard } from "@/components";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getSearchPosts } from "@/lib/appwrite";

const Query = () => {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const safeQuery = query ?? ""; // Handle undefined query gracefully

  const { data: posts, refetch } = useAppwrite(
    () => getSearchPosts(safeQuery) // Wrap in a function to avoid immediate execution
  );

  useEffect(() => {
    refetch(); // Refetch data when `safeQuery` changes
  }, [safeQuery]);

  return (
    <SafeAreaView className="h-full bg-primary pt-6">
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video} 
            avatar={item.users?.avatar}
            creator={item.users?.username}
          />
        )}
        ListHeaderComponent={
          <View className="my-6  px-4">
            <View className="gap-y-2 flex-col">
              <Text className="text-white font-pmedium text-sm">
                Search Result
              </Text>
              <Text className="text-3xl font-psemibold text-white">
                {safeQuery || "No result"}
              </Text>
            </View>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={safeQuery} />
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Videos Found"
            subtitle={`No videos match your search: ${safeQuery}`}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Query;
