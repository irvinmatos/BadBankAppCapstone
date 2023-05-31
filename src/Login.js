import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import { auth, signInWithGoogle, app, logInWithEmailAndPassword } from './config/firebase'
import {useAuthState} from 'react-firebase-hooks/auth';

function Login({isLoggedIn, setIsLoggedIn, setUser, user  }){
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      await logInWithEmailAndPassword(email, password);
      navigate('/balance', { state: { email } });
      setIsLoggedIn(true);
      setUser(user);
    } catch (error) {
      console.log('Login failed', error);
    }
  }

 
  return (
    <div className="login">
      <div className="login__container">
        <h3>Log in </h3>
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br />
        <button className="login__btn" onClick={handleLogin}>
          Login
        </button>


        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/createaccount">Create Account</Link> now.
        </div>
      </div>
    </div>
  );
}
  
export default Login;