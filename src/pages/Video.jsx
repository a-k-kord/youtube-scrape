import React, {useState} from "react";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const VideoFrame = styled.iframe`
  height: 100%;
  width: 100%;
  border: 0;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const params = new URLSearchParams(useLocation().search);
  const title = params.get('title');

  const videoId = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  return (
          <VideoFrame width="100%" height="100%"
                      title={currentVideo?.title}
                      src={`https://cdn.bazr.ru//videocontent/global/novia/ytb.html?id=${videoId}&title=${title}`}
          ></VideoFrame>
  );
};

export default Video;
