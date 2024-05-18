import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Employee Portal!</h1>
      <p>Please <Link to="/services">click here</Link> to choose a service.</p>
    </div>
  );
};

export default Home;