import React, { useState } from 'react';
import InputField from "../Components/InputField";
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import VpnKeySharpIcon from '@mui/icons-material/VpnKeySharp';
import c from "./Login.module.scss";
import MainButton from '../Components/MainButton/MainButton';
import PageHeader from '../Components/PageHeader/PageHeader';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('refreshToken', data.refreshToken);

        window.location.href = '/dashboard';
        console.log('Login successful');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <>
      <PageHeader heading="Login" />
      <div className={c.container}>
        <h1 className={c.title}>Party Poll</h1>
        <div className={c.separator}></div>
        <p className={c.loginDescription}>Log in to see your polls!</p>
        <div className={c.inputwidth}>
        <InputField
          startIcon={<PersonSharpIcon className={c.personSVG} />}
          label={"Username"}
          placeholder={"Username"}
          onChange={handleUsernameChange}
          sx={{ marginBottom: '1.5rem' }}
        />
        </div>
        <div className={c.inputwidth}>
        <InputField
          startIcon={<VpnKeySharpIcon className={c.personSVG} />}
          label={"Password"}
          placeholder={"Password"}
          type={'password'}
          onChange={handlePasswordChange}
          sx={{ marginBottom: '3rem' }}
        />
        </div>

        {error && <p className={c.error}>{error}</p>}
        <MainButton text={"Submit"} onClick={handleSubmit} />
      </div>
    </>
  );
};

export default Login;
