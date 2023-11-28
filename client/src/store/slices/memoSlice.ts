import { createSlice } from '@reduxjs/toolkit';

interface MemoState {
  memoTab: 'personal' | 'received' | 'sent' | null;
  highlightMemoId: string | null;
  editMemoId: string | null;
  addingMemo: boolean;
  removingMemo: boolean;
}

const initialState: MemoState = {
  memoTab: null,
  highlightMemoId: null,
  editMemoId: null,
  addingMemo: false,
  removingMemo: false
};

const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {
    setMemoTab: (state, action) => {
      state.memoTab = action.payload;
    },
    setHighlightMemoId: (state, action) => {
      state.highlightMemoId = action.payload;
    },
    setEditMemoId: (state, action) => {
      state.editMemoId = action.payload;
    },
    setAddingMemo: (state, action) => {
      state.addingMemo = action.payload;
    },
    setRemovingMemo: (state, action) => {
      state.removingMemo = action.payload;
    }
  },
});

export const { setMemoTab, setHighlightMemoId, setEditMemoId, setAddingMemo, setRemovingMemo } = memoSlice.actions;
export default memoSlice.reducer;
