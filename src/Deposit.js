import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { firestore, auth } from './config/firebase';
import { useNavigate } from 'react-router-dom';

function Deposit() { 
  const [amount, setAmount] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showAlert) {
      // Delay the redirection after 3 seconds
      const timeoutId = setTimeout(() => {
        navigate('/balance');
      }, 3000);

      // Clean up the timeout when the component unmounts or when showAlert changes
      return () => clearTimeout(timeoutId);
    }
  }, [showAlert, navigate]);

  const handleDeposit = async () => {
    try {
      // Perform deposit logic here
      const user = auth.currentUser;
      const email = user.email;
      console.log('Deposit:', email, amount);
  
      // Getting current balance from firebase database
      const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        console.log('User not found');
        return;
      }
  
      const userDoc = userSnapshot.docs[0];
      const existingBalance = userDoc.data().balance;
  
      // Calculate the new balance
      const newBalance = existingBalance + Number(amount);
  
      // Update the balance in the Firestore database
      const userRef = doc(firestore, 'users', userDoc.id);
      await updateDoc(userRef, { balance: newBalance });
  
      // Reset form field
      setAmount('');
      setShowAlert(true);
    } catch (error) {
      console.error('Deposit failed', error);
    }
  };

  return (
    <div className="deposit">
      <div className="deposit__container">
        <h3>Deposit amount</h3>
        <input
          type="text"
          className="deposit__textBox"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <br />
        <button className="deposit__btn" onClick={handleDeposit}>
          Deposit
        </button>
        {showAlert && <div className="success-alert">Deposit completed successfully! <br/> Redirecting to see Balance.</div>}
      </div>
    </div>
  );
}

export default Deposit;
