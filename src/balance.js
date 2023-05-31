import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, auth } from './config/firebase';
import  './index.css'

function Balance() {
  const [balance, setBalance] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userId = auth.currentUser.uid;
        const q = query(collection(firestore, 'users'), where('uid', '==', userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const {name} = doc.data();
          const { balance } = doc.data();
          setBalance(balance);
          setName(name);
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  
  return (
    <div className="deposit">
      <div className="deposit__container">
      <h3>Welcome in {name}</h3>
      <h5>Bellow is the balance of your account</h5>
      <br/>

      <p>Balance: ${balance}</p>
      <br/>

    </div>
    </div>
   
  );
}

export default Balance;
