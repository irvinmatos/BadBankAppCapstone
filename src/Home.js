import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';
import { UserContext } from './context';


function Home(){
  return (
    <Card>
      <CardHeader>BadBank Landing Module</CardHeader>
      <CardBody>
        <CardTitle tag="h1">Welcome to the bank</CardTitle>
        <CardText>You can move around using the navigation bar.</CardText>
        <img src="bank.png" className="img-fluid" alt="Responsive image" />
      </CardBody>
    </Card>
  );
}

export default Home;
