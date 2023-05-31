import React, { useState } from 'react';
import {registerWithEmailAndPassword, firestore, auth, updateProfile   } from './config/firebase'
import { BrowserRouter as Router, Route, Routes, useNavigate, Link} from 'react-router-dom';


function CreateAccount(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  async function handleCreate() {
    
    try {
      const response = await registerWithEmailAndPassword(name, email, password);
    console.log('response:', response);

    if (response && response.user) {
        const user = response.user;
        const userRef = firestore.collection('users').doc(user.uid);
        const amount = 100;
      
        await userRef.set({
          name: name,
          email: email,
          balance: amount
        });
      
      await user.updateProfile({
        displayName: name
      });
    }

      console.log('Account created',name, email, password);
      setShowAlert(true);
      navigate('/balance', { state: { email, name } });

    } catch (error) {
      console.log('Account creation failed', error);
    }
  }

 
  return (
    <div className="login">
      <div className="login__container">
      <h3>Create Account</h3>
      <input
          type="text"
          className="login__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Full Name"
        />
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
        <button className="login__btn" onClick={handleCreate}>
          Create 
        </button>
        {showAlert && (
          <div className="success-alert">
            Transfer completed successfully! Redirecting to see updated balances.
          </div>
        )}

        <div>
          Already have an account? <Link to="/login">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default CreateAccount;