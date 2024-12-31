import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { EmptyState, SearchInput, Trending, VideoCard } from "@/components";
import { router } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getfavPosts } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useGlobalContext()
  const { data: posts, loading, refetch } = useAppwrite(()=>getfavPosts(user.$id));
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => {
          return (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              avatar={item.users.avatar}
              creator={item.users.username}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text
                  onPress={() => router.push(`/query/video`)}
                  className="text-3xl font-psemibold text-white"
                >
                  Saved Videos
                </Text>
              </View>
            </View>
            <SearchInput />
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos Found"
            subtitle="Be the first to upload a video"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
