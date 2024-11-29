import * as React from "react";
import { useEffect, useState } from "react";
import { Text, Dimensions, StyleSheet, FlatList } from "react-native";
import { YOUTUBE_API_KEY } from "../../creds.json";
import youtubeData from "../../data.json";
import Video from "../components/Video";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
    borderColor: "red",
    borderWidth: 1,
    flexDirection: "row",
    // margin: 80,
  },
  title: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    margin: 24,
    textAlign: "center",
  },
});

const Home = () => {
  const [data, setData] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${getSearchTerm()}&key=${YOUTUBE_API_KEY}`;

  useEffect(() => {
    fetchData();
  }, []);

  const getColumns = () => {
    const screenWidth = Dimensions.get("window").width;
    const itemWidth = 320; // Width of each video item (thumbnail + padding)
    const columns = Math.floor(screenWidth / (itemWidth + 10)); // 10 is margin between items
    return columns >= 1 ? columns : 1; // Ensure at least one column
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && pageToken) {
      fetchData(pageToken);
    }
  };

  const fetchData = async (nextPageToken = "", refreshing = false) => {
    const baseUrl = "https://youtube.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
      part: "snippet",
      q: "programming",
      type: "video",
      key: YOUTUBE_API_KEY,
      maxResults: "20",
      pageToken: nextPageToken,
    });

    const urlWithParams = `${baseUrl}?${params.toString()}`;
    try {
      if (refreshing) setIsRefreshing(true);
      else setIsLoadingMore(true);
      // const response = await fetch(urlWithParams, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //   },
      // });

      // console.log("T HE DATA IS ", response);

      // if (!response.ok) throw new Error("Network response was not ok");
      // const youtubeData = await response.json();
      setData((prevData) =>
        refreshing ? youtubeData.items : [...prevData, ...youtubeData.items]
      );
      setPageToken(youtubeData.nextPageToken || "");
      console.log("T HE DATA IS  data", data);
    } catch (err) {
      console.log("Something went wrong while fetching data", err);
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    fetchData("", true); // Refresh without pageToken
  };

  return (
    <FlatList
      styles={{ backgroundColor: "green" }}
      data={data}
      renderItem={({ item }) => <Video details={item} />}
      numColumns={20}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      columnWrapperStyle={{ flexWrap: "wrap" }}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
    />
  );
};

export default Home;
