import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "@/components";
import { icons } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import { CreateVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as VideoThumbnails from "expo-video-thumbnails";

type FileType = {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
};

// Define the types for video and thumbnail
type FormData = {
  title: string;
  video: FileType | null;
  thumbnail: FileType | null;
  prompt: string;
};

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();
  const [form, setForm] = useState<FormData>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: ``,
  });

  const [videoDuration, setVideoDuration] = useState(0);

  const player = useVideoPlayer(form.video, (player) => {
    player.loop = true;
    player.pause();
    player.staysActiveInBackground = false
    console.log(player.duration);
    console.log("Player:", player);
    

    

    // Set video duration once it's available
    if (player.duration && player.duration !== videoDuration) {
      setVideoDuration(Math.floor(player.duration / 1000)); // Convert to seconds if needed
    }
  });


  

  // To generate a random timestamp within the video duration
  const getRandomTimestamp = () => {
    if (videoDuration > 0) {
      return Math.floor(Math.random() * videoDuration); // Generate random seconds within duration
    }
    return 0;
  };

  useEffect(() => {
    if (form.video) {
      // generateThumbnail();
      getRandomTimestamp();
    }
  }, [form.video]);

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === `video` ? "videos" : `images`,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileType: FileType = {
        uri: asset.uri,
        name: asset.fileName || "unknown",
        mimeType: asset.mimeType || "",
        size: asset.fileSize || 0,
      };

      if (selectType === "image") {
        setForm({ ...form, thumbnail: fileType });
      } else if (selectType === "video") {
        setForm({ ...form, video: fileType });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.thumbnail || !form.video) {
      return Alert.alert("Fill in all fields");
    }

    setUploading(true);

    try {
      await CreateVideo({
        ...form,
        userId: user?.$id || "", // Ensure `userId` is a string
      });

      Alert.alert("Success", "Post Uploaded Successfully!");
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const generateThumbnail = async () => {
    if (!form.video) {
      return console.warn("No video selected");
    }

    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(form.video.uri, {
        time: videoDuration, // Thumbnail time in milliseconds
      });

      // Dynamically set the thumbnail name based on the video name
      const videoName = form.video.name.replace(/\.[^/.]+$/, ""); // Remove the file extension
      const thumbnailFile: FileType = {
        uri,
        name: `${videoName}_thumbnail.jpg`, // Add "_thumbnail" suffix
        mimeType: "image/jpeg",
        size: 0, // Optional unless you calculate the size
      };

      setForm({ ...form, thumbnail: thumbnailFile });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        {(form.title || form.video || form.thumbnail || form.prompt) && (
          <Text
          onPress={()=>{
              setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: "",
              });
          }}
          className="text-base text-right text-secondary-100  w-full font-pmedium">Clear</Text>
        )}
        <FormField
          value={form.title}
          title="Video Title"
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-white font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity
            className="min-w-80 w-full mx-auto h-80 rounded-3xl flex justify-center items-center"
            onPress={() => {
              openPicker("video");
            }}
          >
            {form.video ? (
              <VideoView
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                startsPictureInPictureAutomatically
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {form.video && (
            <CustomButton
              handlePress={() => generateThumbnail()}
              textStyles=" "
              isLoading={false}
              title="Generate Thumbnail with AI"
              containerStyles="text-base text-gray-100 font-pmedium mt-3"
            />
          )}
        </View>
        <FormField
          value={form.prompt}
          title="AI Prompt"
          placeholder="Prompt..."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="my-7"
        />
        <CustomButton
          title="submit and publish"
          handlePress={submit}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
