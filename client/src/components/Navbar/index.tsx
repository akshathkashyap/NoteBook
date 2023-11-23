import React, { FC, useState } from 'react';
import Settings from '../Settings';
import { useDispatch } from 'react-redux';
import { setTab } from '../../store/slices/tabSlice';
import { setToken } from '../../store/slices/authSlice';
import './index.css';

const ValidTabs: string[] = ['notebook', 'memos'];

const Navbar: FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleClick = (event: React.SyntheticEvent<HTMLHeadingElement| HTMLSpanElement>) => {
    const elemId: string = event.currentTarget.id as 'notebook' | 'memos' | 'logout' | 'settings';
    if (elemId === 'logout') {
      localStorage.removeItem('token');
      sessionStorage.clear();
      dispatch(setToken(null));
      return;
    }

    if (elemId === 'settings') {
      handleSettings();
      return;
    }

    if (!ValidTabs.includes(elemId)) return;

    dispatch(setTab(elemId));
  };

  return (
    <>
      <nav className='navbar'>
        <h1 id='notebook' onClick={ handleClick }>NoteBook</h1>
        <span id='memos' className='material-symbols-outlined icon' onClick={ handleClick }>
          note_stack
        </span>
        <span id='logout' className="material-symbols-outlined icon" onClick={ handleClick }>
          logout
        </span>
        <span id='settings' className='material-symbols-outlined icon' onClick={ handleClick }>
          settings
        </span>
      </nav>
      <Settings isSettingsOpen={ isSettingsOpen } setIsSettingsOpen={ setIsSettingsOpen } />
    </>
  );
};

export default Navbar;
