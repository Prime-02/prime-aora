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
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { AddToFav, getAllPosts, getCurrentUser, getLatestPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

const Home = () => {
  const { user, setIsLoggedIn, setUser, setIsLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, loading, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: latestPostRetch } = useAppwrite(getLatestPosts);
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await latestPostRetch()
    setRefreshing(false);
  };


  const handleAddtoFav = async(videoId: string, databaseId:string, collectionId: string)=>{
    try {
      await AddToFav(videoId, user?.$id, databaseId, collectionId)
      Alert.alert(``, `video added to favorite`);
      
    } catch (error: any) {
      console.error("Error adding video to favorites:", error);
      Alert.alert("Error", "Could not add video to favorites.");
    }
  }
  

  

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
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) =>{          
          return (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            avatar={item.users.avatar}
            creator={item.users.username}
            menuOptions={
               [
      {label: `Add to favorite`, onSelect: ()=> handleAddtoFav(
        item?.$id,
        item?.$databaseId,
        item?.$collectionId
      ) }
    ]
            }
          />
        )}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-white font-pmedium text-sm">
                  Welcome Back
                </Text>
                <Text 
                onPress={()=>router.push(`/query/video`)}
                className="text-3xl font-psemibold text-white">
                  {user?.username ? user.username : "User"}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  className="w-9 h-10"
                  source={images.logoSmall}
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 mb-8">
              <Text className="text-white text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
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
