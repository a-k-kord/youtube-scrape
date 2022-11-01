import React, {useEffect, useState} from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Popup from "./Popup";
import {setSearchQuery} from "../redux/channelSlice";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({theme}) => theme.bgLighter};
  height: 56px;
  z-index: 1;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({theme}) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({theme}) => theme.text};
  width: 100%;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const Navbar = () => {
    const navigate = useNavigate()
    const params = new URLSearchParams(useLocation().search);
    const [q, setQ] = useState('');
    const {currentUser} = useSelector((state) => state.user);
    const searchQuery = useSelector(({channel}) => channel.searchQuery) ;

    const dispatch = useDispatch();

    useEffect(()=>{
        setQ(searchQuery);
    }, [searchQuery])

    const handleSearch = () => {
        dispatch(setSearchQuery(q));
        navigate(`/search?q=${q}`)
    }

    return (
        <>
            <Container>
                <Wrapper>
                    <Search>
                        <Input
                            placeholder="Search"
                            onChange={(e) => setQ(e.target.value)}
                            value={q}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <SearchOutlinedIcon onClick={() => handleSearch()} />
                    </Search>

                </Wrapper>
            </Container>
        </>
    );
};

export default Navbar;
