import * as React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";

const styles = StyleSheet.create({
  box: {
    maxWidth: 300,
    maxHeight: 300,
    margin: 20,
  },
  thumbnail: {
    width: "100%",
    flex: 3,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  text: {
    marginHorizontal: 10,
    marginBottom: 5,
    color: "gray",
  },
});

const Video = ({ details }) => {
  const { width: screenWidth } = Dimensions.get("window");
  const { title, thumbnails, channelTitle, publishTime } =
    details?.snippet || {};
  const { url } = thumbnails.high;

  let dateToShow = publishTime.slice(0, 10).split("-").reverse().join("/");

  return (
    <View
      style={{
        ...styles.box,
        width: screenWidth / 3,
        height: screenWidth / 3,
      }}
    >
      <View style={{ marginBottom: 15 }}>
        <Image style={styles.image} source={url} resizeMode="cover" />
      </View>
      <View
        styles={{
          flexShrink: 1,
        }}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode={"tail"}
          style={{
            ...styles.text,
            fontSize: screenWidth * 0.02,
            color: "black",
          }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={{
            ...styles.text,
            fontSize: screenWidth * 0.012,
          }}
        >
          {channelTitle}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={{
            ...styles.text,
            fontSize: screenWidth * 0.012,
          }}
        >
          {dateToShow}
        </Text>
      </View>
    </View>
  );
};

export default Video;
