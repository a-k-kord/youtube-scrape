import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
    const params = new URLSearchParams(useLocation().search);
    const [videos, setVideos] = useState([]);
    const [channel, setChannel] = useState({});
    const query = useLocation().search;

    useEffect(() => {

        const fetchVideos = async () => {
            if(params.get('ch') && params.get('q')) {
                const res = await axios.get(`http://localhost:8080/api/search?ch=${params.get('ch')}&q=${params.get('q')}`);
                const {results, channelImg, channelTitle} = res.data;
                setVideos(results);
                setChannel({channelImg, channelTitle});
            }
        };
        fetchVideos();
    }, [query]);

    return <Container>
        {videos?.map(({video}) => (
            <Card key={video.id} video={video} channel={channel} />
        ))}
    </Container>;
};

export default Search;
