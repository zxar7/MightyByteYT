import * as React from "react";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import creds from "../creds/creds.json";
import Video from "../components/Video";

const Home = () => {
  const [data, setData] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
      key: creds.YOUTUBE_API_KEY,
      maxResults: "20",
      pageToken: nextPageToken,
    });

    const urlWithParams = `${baseUrl}?${params.toString()}`;
    try {
      if (refreshing) setIsRefreshing(true);
      else setIsLoadingMore(true);
      const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      // console.log("T HE DATA IS ", response);

      if (!response.ok) throw new Error("Network response was not ok");
      const youtubeData = await response.json();
      setData((prevData) =>
        refreshing ? youtubeData.items : [...prevData, ...youtubeData.items]
      );
      setPageToken(youtubeData.nextPageToken || "");
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
      data={data}
      renderItem={({ item }) => <Video details={item} />}
      numColumns={20}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      columnWrapperStyle={{ flexWrap: "wrap" }}
      onEndReachedThreshold={1}
      onEndReached={handleLoadMore}
    />
  );
};

export default Home;
