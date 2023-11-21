import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  userId: string;
  username: string;
  email: string;
  preferences: Record<string, string | {}>;
}

const initialState: UserState = {
  userId: window.localStorage.getItem('userId') ?? '',
  username: window.localStorage.getItem('username') ?? '',
  email: window.localStorage.getItem('email') ?? '',
  preferences: JSON.parse(window.localStorage.getItem('preferences') ?? '{}')
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPreferences: (state, action) => {
      state.preferences = action.payload;
    },
  },
});

export const { setUserId, setUsername, setEmail, setPreferences } = userSlice.actions;
export default userSlice.reducer;
