import { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setToken } from '../../store/slices/authSlice';
import { setUserId, setUsername, setEmail, setPreferences } from '../../store/slices/userSlice';
import { isValidInput, ValidInputs } from '../../utils';
import RequestApi from '../../lib/RequestApi';
import './index.css';

const APIEndpoints: Record<string, string> = {
  login: '/login',
  getUserData: '/'
};

const Login: FC = () => {
  const identifierRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch();

  const setUserData = async (token: string): Promise<void> => {
    const decodedUserData: any = await jwtDecode(token);
    const tokenData: { userId: string, username: string, email: string, preferences: Record<string, string | {}> } = decodedUserData?.token;

    window.localStorage.setItem('userId', tokenData.userId);
    window.localStorage.setItem('username', tokenData.username);
    window.localStorage.setItem('email', tokenData.email);
    window.localStorage.setItem('preferences', JSON.stringify(tokenData.preferences));

    dispatch(setUserId(tokenData.userId));
    dispatch(setUsername(tokenData.username));
    dispatch(setEmail(tokenData.email));
    dispatch(setPreferences(tokenData.preferences));
  };

  const handleLogin = async (): Promise<void> => {
    const identifier: HTMLInputElement | null = identifierRef.current;
    const password: HTMLInputElement | null = passwordRef.current;

    if (identifier === null || password === null) return;

    const validInputs: ValidInputs = isValidInput(
      {
        username: identifier.value,
        email: identifier.value,
        password: password.value
      }
    );

    if ((!validInputs.username && !validInputs.email) || !validInputs.password) return;

    const endpoint: string = APIEndpoints.login;
    const data: Record<string, string> = {};

    if (validInputs.username) data.username = identifier.value;
    if (validInputs.email) data.email = identifier.value;
    if (validInputs.password) data.password = password.value;

    const requesterApi = new RequestApi({ endpoint });
    const response: Record<string, string> | null = await requesterApi.post({ data });

    if (!response) return;
    
    window.localStorage.setItem('token', response.token);
    await setUserData(response.token);
    dispatch(setToken(response.token));
  };

  return (
    <section className='login'>
      <section
        className='login-display'
        style={{ backgroundImage:`url(${process.env.PUBLIC_URL+ "/NoteBook_logo.jpeg"})` }}
      >
      </section>
      <section className='login-form'>
        <h1>NoteBook</h1>
        <form className='login'>
          <input
            ref={ identifierRef }
            type="text"
            name="userIdentifier"
            id="userIdentifier"
            placeholder='username or email'
            required
          />
          <input
            ref={ passwordRef }
            type="password"
            name="password"
            id="userPassword"
            placeholder='password'
            required
          />
          <input type="button" value="Login" onClick={ handleLogin }/>
        </form>
      </section>
    </section>
  );
};

export default Login;
