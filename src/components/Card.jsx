import axios from "axios";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {format} from "timeago.js";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  position: relative;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const PlaylistIcon = styled(SubscriptionsOutlinedIcon)`
  position: absolute;
  top: 0;
  right: 0;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div`
  width: 100%
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({theme}) => theme.textSoft};
  margin: 9px 0px;
`;

const OriginalLink = styled.a`
  margin-left: 48px;
  font-size: 14px;
  color: ${({theme}) => theme.textSoft};
`;

const Card = ({type, video, playlist, channel}) => {
    // const [channel, setChannel] = useState({});
    //
    // useEffect(() => {
    //   const fetchChannel = async () => {
    //     const res = await axios.get(`/users/find/${video.userId}`);
    //     setChannel(res.data);
    //   };
    //   fetchChannel();
    // }, [video.userId]);

    return (
        <Container type={type}>
            <Link to={`/${playlist ? 'playlist' : 'video'}/${(video || playlist).id}`} style={{textDecoration: "none"}}>
                <Image
                    type={type}
                    src={(video || playlist).thumbnail_src}
                />
                {playlist && <PlaylistIcon />}
                <Details type={type}>
                    <ChannelImage
                        type={type}
                        src={channel.img}
                    />
                    <Texts>
                        <Title>{(video || playlist).title}</Title>
                        <ChannelName>{channel.title}</ChannelName>
                    </Texts>
                </Details>
            </Link>
            <OriginalLink target="_blank" href={(video || playlist).url}> Original Link </OriginalLink>
        </Container>
    );
};

export default Card;
