import { createSlice } from '@reduxjs/toolkit';

interface TabState {
  tab: 'notebook' | 'memos';
}

const initialState: TabState = {
  tab: 'notebook',
};

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;
export default tabSlice.reducer;
