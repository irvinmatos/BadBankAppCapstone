import React, { useState, useEffect  } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { firestore, auth } from './config/firebase';
import { useNavigate } from 'react-router-dom';

function Transfer() {
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
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

  const handleTransfer = async () => {
    try {
      // Perform transfer logic here
      const user = auth.currentUser;
      const senderEmail = user.email;
      console.log('Transfer:', senderEmail, amount, recipientEmail);

      // Getting sender's and recipient's user documents
      const senderQuery = query(collection(firestore, 'users'), where('email', '==', senderEmail));
      const senderSnapshot = await getDocs(senderQuery);
      const recipientQuery = query(collection(firestore, 'users'), where('email', '==', recipientEmail));
      const recipientSnapshot = await getDocs(recipientQuery);

      if (senderSnapshot.empty || recipientSnapshot.empty) {
        console.log('User not found');
        return;
      }

      const senderDoc = senderSnapshot.docs[0];
      const recipientDoc = recipientSnapshot.docs[0];
      const senderBalance = senderDoc.data().balance;
      const recipientBalance = recipientDoc.data().balance;

      // Calculate the new balances
      const newSenderBalance = senderBalance - Number(amount);
      const newRecipientBalance = recipientBalance + Number(amount);

      // Update the balances in the Firestore database
      const senderRef = doc(firestore, 'users', senderDoc.id);
      const recipientRef = doc(firestore, 'users', recipientDoc.id);
      await updateDoc(senderRef, { balance: newSenderBalance });
      await updateDoc(recipientRef, { balance: newRecipientBalance });

      // Reset form fields
      setAmount('');
      setRecipientEmail('');
      setShowAlert(true);
    } catch (error) {
      console.error('Transfer failed', error);
    }
  };

  return (
    <div className="transfer">
      <div className="transfer__container">
        <h3>Transfer amount</h3>
        <input
          type="text"
          className="transfer__textBox"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Recipient Email"
        />
        <br />
        <input
          type="text"
          className="transfer__textBox"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <br />
        <button className="transfer__btn" onClick={handleTransfer}>
          Transfer
        </button>
        {showAlert && (
          <div className="success-alert">
            Transfer completed successfully! Redirecting to see updated balances.
          </div>
        )}
      </div>
    </div>
  );
}

export default Transfer;
