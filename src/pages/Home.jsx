import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import {youtubeScraper} from "../services/scraper";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchFailure, fetchStart, fetchSuccess, setChannel, updateChannelData} from "../redux/channelSlice";
// import {youtubeScraper} from "../services/scraper";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type, channelsProp}) => {
  const [cardList, setCardList] = useState([]);
  const [channelInfo, setChannelInfo] = useState({});
  const dispatch = useDispatch();
  const params = new URLSearchParams(useLocation().search);
  // const searchQuery = useSelector(({query}) => query);
  const {name: curChannelName, error, loading} = channelsProp?.channels[0] ? channelsProp.channels[0] : {};

  // const [ch, SetCh] = useState(channelsProp[0]);
  const [q, SetQ] = useState(params.get('q'));


  useEffect(() => {
    const fetchVideos = async () => {
      if(curChannelName) {
        dispatch(fetchStart());
        const res = await axios.get(`http://localhost:8080/api/search?ch=${curChannelName}${q ? '&q='+q : ''}`);
        if(res.data) {
          dispatch(fetchSuccess());
          const {results, channelImg, channelTitle, nextPageToken, key, error} = res.data;
          if(error) {
            dispatch(fetchFailure());
          } else {
            const list = [
              ...cardList,
              results
            ];
            setCardList(results);
            setChannelInfo({img: channelImg, title: channelTitle});
            dispatch(updateChannelData({
              name: curChannelName,
              img: channelImg,
              title: channelTitle,
              pageData: {nextPageToken, key, results}
            }));
          }
        } else {
          dispatch(fetchFailure());
        }
      }
    };
    fetchVideos();
  }, [type, dispatch, curChannelName, loading, error]);

  return (
    <Container>
      {loading
          ? <div>Loading...</div>
          : channelsProp.channels?.map(channel => {
              return channel.pages?.map(({results}) => {
                return results.map(({ video, playlist }) => (
                    <Card key={video?.id || playlist?.id} video={video} playlist={playlist} channel={channelInfo} />
                ))
              })
            })
      }
    </Container>
  );
};

export default Home;
