import * as React from "react";
import { StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Layout, Text } from "@ui-kitten/components";
import splash from "../../assets/splash.mp4";

export default function SplashVideo({ setIsFinished }) {
  const video = React.useRef(null);

  return (
    <Layout style={{ flex: 1, width: "100%", backgroundColor: "#f4f4ff" }}>
      <Video
        ref={video}
        style={styles.video}
        source={splash}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onLoad={() => {
          video.current.playAsync();
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            setIsFinished(true);
          }
        }}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
