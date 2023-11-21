import React, { FC, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, setEmail, setPreferences } from '../../store/slices/userSlice';
import { RootState } from '../../store/rootReducer';
import RequestApi from '../../lib/RequestApi';
import { isValidInput } from '../../utils';
import './index.css';

interface SettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: CallableFunction
}

const APIEndpoints: Record<string, string> = {
  update: '/user/update',
};

const Settings: FC<SettingsProps> = (props: SettingsProps) => {
  const isSettingsOpen = props.isSettingsOpen;
  const setIsSettingsOpen = props.setIsSettingsOpen;

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const themeRef = useRef<string | null>(null);

  const dispatch = useDispatch();
  const username: string = useSelector((state: RootState) => state.user.username);
  const email: string = useSelector((state: RootState) => state.user.email);
  const preferences: Record<string, string | {}> = useSelector((state: RootState) => state.user.preferences);

  let isMouseLocationValid: boolean = true;

  const mouseLocationCheck = (event: React.MouseEvent) => {
    if (event.type === 'mouseenter') {
      isMouseLocationValid = false;
    } else if (event.type === 'mouseleave') {
      isMouseLocationValid = true;
    }
  };

  const closeSettings = () => {
    if (!isMouseLocationValid) return;
    setIsSettingsOpen(false);
  };

  const saveUserData = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
  };

  const handleSave = async () => {
    if (!usernameRef.current || !emailRef.current || !themeRef.current) return;

    const username: string = usernameRef.current.value;
    const email: string = emailRef.current.value;
    const theme: string = themeRef.current as string;
    const preferences: {} = { theme };

    const validInputs = isValidInput({ username, email })

    if (!validInputs.username || !validInputs.email) return;

    const endpoint: string = APIEndpoints.update;
    const requesterApi = new RequestApi({ endpoint });
    const updates: Record<string, string | {}>[] = [
      { username },
      { email },
      { preferences }
    ];
    
    const responses: { parameter: string; response: Record<string, string> | null; }[] = await Promise.all(updates.map(async (update) => {
      const response: Record<string, string> | null = await requesterApi.post({ data: update });
      return {parameter: Object.keys(update)[0], response};
    }))

    responses.forEach((response) => {
      if (!response.response) return;
      
      const parameter: string = response.parameter;
      switch (parameter) {
        case 'username': {
          saveUserData('username', username);
          dispatch(setUsername(username));
          return;
        }
        case 'email': {
          saveUserData('email', email);
          dispatch(setEmail(email));
          return;
        }
        case 'preferences': {
          saveUserData('preferences', JSON.stringify(preferences));
          dispatch(setPreferences(preferences));
          return;
        }
        default: {
          return;
        }
      }
    });

    setIsSettingsOpen(false);
  };

  const handleTheme = (event: React.MouseEvent) => {
    const themes: NodeListOf<Element> = document.querySelectorAll('form.settings > span.theme');

    themes.forEach((theme: Element) => {
      theme.classList.remove('selected');
    });

    if (event.currentTarget.textContent === 'light_mode') {
      themeRef.current = 'light';
    } else if (event.currentTarget.textContent === 'dark_mode') {
      themeRef.current = 'dark';
    }
    event.currentTarget.classList.add('selected');
  };

  return (
    <section className={`settings-page ${isSettingsOpen ? 'active' : 'inactive'}`} onClick={ closeSettings }>
      <form
        className='settings'
        onMouseEnter={ mouseLocationCheck }
        onMouseLeave={ mouseLocationCheck }
      >
        <h1>My Details</h1>
        <label htmlFor='username'>username</label>
        <input ref={ usernameRef } type='text' name='username' id='username' defaultValue={ username } />
        <label htmlFor='email'>email</label>
        <input ref={ emailRef } type='text' name='email' id='email' defaultValue={ email } />
        <span className='header-spacer'></span>
        <h1>Preferences</h1>
        <p>theme</p>
        <span
          className={`material-symbols-outlined theme ${!preferences.theme || preferences.theme === 'light' ? 'selected' : ''}`}
          onClick={ handleTheme }
        >
          light_mode
        </span>
        <span
          className={`material-symbols-outlined theme ${preferences.theme === 'dark' ? 'selected' : ''}`}
          onClick={ handleTheme }
        >
          dark_mode
        </span>
        <input type='button' value='Save' onClick={ handleSave }/>
      </form>
    </section>
  );
};

export default Settings;
