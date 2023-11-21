import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from './store/slices/authSlice';
import { RootState } from './store/rootReducer';
import Navbar from './components/Navbar';
import Workspace from './components/Workspace';
import Login from './components/Login';
import { setTheme } from './utils';
import './App.css';

const App: FC = () => {
  const [tokenLoaded, setTokenLoaded] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const preferences: Record<string, string | {}> = useSelector((state: RootState) => state.user.preferences);

  useEffect(() => {
    const theme: string | {} | undefined= preferences.theme;

    if (!theme) return; 
    if (typeof(theme) === 'object') return;

    setTheme(theme as string);
  }, [preferences]);

  useEffect(() => {
    const savedToken: string | null | undefined = window.localStorage.getItem('token');

    dispatch(setToken(savedToken));
    setTokenLoaded(true);
  }, [dispatch]);

  if (!tokenLoaded) {
    // Display a loading spinner or some other indication
    return null;
  }

  if (token) {
    return (
      <>
        <Navbar />
        <Workspace />
      </>
    );
  }

  return <Login />;
};

export default App;
