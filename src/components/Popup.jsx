import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
// import app from "../firebase";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setChannel, removeChannel} from "../redux/channelSlice";


const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  background-color: ${({theme}) => theme.bgLighter};
  color: ${({theme}) => theme.text};
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;
  z-index: 1;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;
const Desc = styled.textarea`
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.textSoft};
`;
const RedButton = styled(Button)`
  color: red;
`;
const Label = styled.label`
  font-size: 14px;
`;
const Popup = ({channelNameProp, setOpen}) => {
    const [chName, setChName] = useState(channelNameProp);
    const inputRef = useRef();
    const dispatch = useDispatch();

    const params = new URLSearchParams(useLocation().search);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleChange = (e) => {
        setChName(e.target.value);
    };

    const saveChannel = () => {
        if(channelNameProp !== inputRef.current.value) {
            dispatch(setChannel({oldCh: channelNameProp, newCh: inputRef.current.value}))
        }
        setOpen(false)
    }

    const deleteChannel = (chName) => {
        dispatch(removeChannel(channelNameProp));
        setOpen(false);
    }

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Add Youtube channel</Title>
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Channel name"
                    name="name"
                    value={chName}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            saveChannel();
                        }
                    }}
                />
                <ButtonsContainer>
                    <Button onClick={saveChannel}>{channelNameProp ? 'Save' : 'Add'}</Button>
                    {channelNameProp && <RedButton onClick={deleteChannel}>Remove</RedButton>}
                </ButtonsContainer>
            </Wrapper>
        </Container>
    );
};

export default Popup;
