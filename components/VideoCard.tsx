import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import VideoScreen from "@/components/video";
import PopupMenu from "./PopUpMenu";

type MenuOptionItem = {
  label: string; // Text to display
  onSelect: () => void; // Function to call when selected
  disabled?: boolean; // Whether the option is disabled
  textStyle?: object; // Optional custom text styles
};

type VideoCardProps = {
  title: string;
  creator: string;
  avatar: string;
  thumbnail: string;
  video: string;
  menuOptions?: MenuOptionItem[]; 
};

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  creator,
  avatar,
  thumbnail,
  video,
  menuOptions= [],
}) => {
  const [play, setPlay] = useState<string | null>(null);

  

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <PopupMenu
            triggerText=""
            options={menuOptions}
          />
        </View>
      </View>

      {play === video ? (
        <View className="w-full h-60 mt-12">
          <VideoScreen
            url={video}
            containerStyle="w-full h-60 rounded-xl mt-3 overflow-hidden"
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(video)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
