import React from 'react';

function CategoriesFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    'All',
    'Jobs',
    'Agriculture',
    'Education',
    'Small Business',
    'Technology',
    'Health Info'
  ];

  return (
    <div className="category-filter">
      <h3>🔍 Filter by Category</h3>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoriesFilter;