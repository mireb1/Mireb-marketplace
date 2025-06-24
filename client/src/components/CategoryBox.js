import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const CategoryBox = ({ category, icon }) => {
  return (
    <Link to={`/category/${category}`} className="text-decoration-none">
      <Card className="category-box mb-4 text-center">
        <Card.Body>
          <div className="category-icon mb-2">
            <i className={`fas ${icon}`}></i>
          </div>
          <Card.Title>{category}</Card.Title>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CategoryBox;
