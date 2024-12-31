import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View } from "react-native";

type VideoScreenProps = {
  url: string;
  containerStyle?: string;
};

export default function VideoScreen({ url, containerStyle }: VideoScreenProps) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
    player.play();
    
  });
  

  return (
    <View
      // style={styles.contentContainer}
      className={`flex items-center justify-center  ${containerStyle}`}
    >
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});
