import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import {youtubeScraper} from "../services/scraper";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchFailure,
  fetchStart,
  fetchSuccess,
  setChannel,
  setSearchQuery,
  updateChannelData
} from "../redux/channelSlice";
// import {youtubeScraper} from "../services/scraper";
const Container = styled.div`
  display: flex;
  justify-content: start;
  column-gap: 50px;
  row-gap: 20px;
  flex-wrap: wrap;
`;

const serverHost = 'http://localhost:8080';

const Home = ({type, channelsProp}) => {
  const [cardList, setCardList] = useState([]);
  const [channelInfo, setChannelInfo] = useState({});
  const dispatch = useDispatch();
  const params = new URLSearchParams(useLocation().search);
  const [q, SetQ] = useState(params.get('q'));
  const searchQuery = useSelector(({channel}) => channel.searchQuery);

  const {name: curChannelName, error, loading} = channelsProp?.channels[0] ? channelsProp.channels[0] : {};
  // const [ch, SetCh] = useState(channelsProp[0]);


  useEffect(() => {
    const fetchVideos = async () => {
      if(curChannelName) {
        dispatch(fetchStart());
        if(params.get('q') !== searchQuery) {
          dispatch(setSearchQuery(params.get('q') || ''));
        }
        const res = await axios.get(`${serverHost}/api/search?ch=${curChannelName}${searchQuery ? '&q='+searchQuery : ''}`);
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
  }, [type, dispatch, curChannelName, loading, error, searchQuery]);

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
