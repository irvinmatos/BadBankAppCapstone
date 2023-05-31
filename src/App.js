import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './Home';
import NavBar from './NavBar';
import CreateAccount from './CreateAccount';
import Login from './Login';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import AllData from './AllData';
import Transfer from './transfer';
import { auth } from './config/firebase';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        setIsLoggedIn(true);
        setUser(user);
        setDisplayName(user.displayName);
      } else {
        // User is logged out
        setIsLoggedIn(false);
        setUser(null);
        setDisplayName('');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Show a loading state while checking authentication
    return <p>Success! Redirection is Loading...</p>;
  }

  return (
    <>
    <NavBar isLoggedIn={!!user} handleLogout={() => auth.signOut()}  />;
    <Router>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/createAccount"
            element={user ? <CreateAccount setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

          <Route
            path="/withdraw"
            element={user ? <Withdraw email={user.email} /> : <Navigate to="/login" />}
          />
          <Route
            path="/deposit"
            element={user && user.email ? <Deposit email={user.email} /> : <Navigate to="/login" />}
          />
          <Route
            path="/transfer"
            element={user && user.email ? <Transfer email={user.email} /> : <Navigate to="/login" />}
          />
          <Route
            path="/allData"
            element={user ? <AllData /> : <Navigate to="/login" />}
          />

        </Routes>
      
    </Router>
    </>
  );
}

export default App;
