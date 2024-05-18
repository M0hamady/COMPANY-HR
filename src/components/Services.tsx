import React from 'react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  return (
    <div>
      <h1>Services</h1>
      <ul>
        <li>
          <Link to="/attendance">الحضور والانصراف</Link>
        </li>
        {/* Add other services here */}
      </ul>
    </div>
  );
};

export default Services;