import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChannel: null,
  channels: [],
  loading: false,
  error: false,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentChannel = action.payload;
    },
    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    setChannel: (state, action) => {
      const {oldCh, newCh} = action.payload;
      const oldChData = state.channels.filter(({name}) => name === oldCh);
      if (oldChData.length) {
        oldChData[0].name = newCh;
        oldChData[0].pages = [];
      } else {
        state.channels.push({
          name: newCh
        });
      }
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(({name}) => name !== action.payload);
    },
    updateChannelData: (state, action) => {
      const {name, img, title, pageData} = action.payload;
      const idx = state.channels.findIndex((item) => item.name === name);
      if(idx > -1) {
        const {name, pages} = state.channels[idx];
        state.channels[idx] = {
          name: name,
          img: img,
          title: title,
          pages: [
              // ...(pages || []),
            pageData
          ]
        }
      } else {
        state.channels.push({
          name,
          img,
          title,
          pages: [pageData]
        })
      }

    }
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, setChannel, removeChannel, updateChannelData } =
  channelSlice.actions;

export default channelSlice.reducer;
