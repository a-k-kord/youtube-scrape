import React, {useState} from "react";
import styled from "styled-components";
import AdvideoTube from "../img/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Popup from "./Popup";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {setSearchQuery} from "../redux/channelSlice";

const Container = styled.div`
  flex: 1;
  background-color: ${({theme}) => theme.bgLighter};
  height: 100vh;
  color: ${({theme}) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Wrapper = styled.div`
  padding: 18px 26px;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: ${({theme}) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({theme}) => theme.soft};
`;

const Login = styled.div``;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({darkMode, setDarkMode}) => {
    const {currentUser} = useSelector((state) => state.user);

    const [currentChName, SetCurrentChName] = useState('')
    const [open, setOpen] = useState(false);
    const params = new URLSearchParams(useLocation().search);
    const {channels} = useSelector(({channel}) => channel);

    const handlePopupOpen = (chName) => {
        SetCurrentChName(chName);
        setOpen(true);

    }

    return (
        <>
            <Container>
                <Wrapper>
                    <Link to={`/`}
                          style={{textDecoration: "none", color: "inherit"}}>
                        <Logo>
                            <Img src={AdvideoTube} />
                            AdvideoTube
                        </Logo>
                    </Link>
                    <Link to={`/videos/${params.get('ch') ? '?ch=' + params.get('ch') : ''}`}
                          style={{textDecoration: "none", color: "inherit"}}>
                        <Item>
                            <VideoLibraryOutlinedIcon />
                            Videos
                        </Item>
                    </Link>
                    <Link to={`/playlists/${params.get('ch') ? '?ch=' + params.get('ch') : ''}`}
                          style={{textDecoration: "none", color: "inherit"}}>
                        <Item>
                            <SubscriptionsOutlinedIcon />
                            Playlists
                        </Item>
                    </Link>
                    <Hr />

                    <Title>CHANNELS</Title>
                    {
                        channels && (
                            (channels?.map(({name}, idx) => <Item key={idx} onClick={() => handlePopupOpen(name)}>{name}</Item>))
                            ||
                            (!channels.map && <Item>{channels}</Item>))
                    }
                    <Button onClick={() => handlePopupOpen('')}>
                        <AddOutlinedIcon />
                        ADD
                    </Button>

                </Wrapper>
                <Wrapper>
                    <Hr />
                    <Item onClick={() => setDarkMode(!darkMode)}>
                        <SettingsBrightnessOutlinedIcon />
                        {darkMode ? "Light" : "Dark"} Mode
                    </Item>
                </Wrapper>
            </Container>

            {open && <Popup setOpen={setOpen} channelNameProp={currentChName} />}
        </>
    );
};

export default Menu;
