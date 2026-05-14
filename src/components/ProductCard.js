import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ 
  product, 
  isSelected, 
  onSelect, 
  isRecommended = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert to number and format
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const handleSelect = () => {
    onSelect(product);
  };

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''}`}>
      {/* Header */}
      <div className="product-header">
        <div className="product-badge-row">
          {isRecommended && (
            <span className="product-badge recommended">★ Recommended</span>
          )}
          <span className="product-badge">{product.coverage_level}</span>
        </div>
        <div className="product-name">{product.product_name}</div>
        <div className="product-plan">{product.plan_name}</div>
        <div className="product-provider">{product.provider}</div>
      </div>

      {/* Body */}
      <div className="product-body">
        <p className="product-description">{product.why_recommended}</p>

        {/* Pricing */}
        <div className="product-pricing">
          <div className="price-item">
            <span className="price-label">Monthly Cost</span>
            <span className="price-value">${formatPrice(product.monthly_cost)}</span>
          </div>
          <div className="price-item">
            <span className="price-label">Total Retail Price</span>
            <span className="price-value retail">${formatPrice(product.retail_cost)}</span>
          </div>
        </div>

        {/* Term & Taxable */}
        <div className="product-term">
          <strong>{product.recommended_term_months} months coverage</strong>
          {product.is_taxable ? ' • Taxable' : ' • Non-taxable'}
        </div>

        {/* Benefits */}
        {product.top_benefits && product.top_benefits.length > 0 && (
          <div className="product-benefits">
            {product.top_benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="expandable-content">
          <h4>Additional Information</h4>
          {product.best_for && (
            <>
              <p><strong>Best For:</strong> {product.best_for}</p>
            </>
          )}
          <p>{product.why_recommended}</p>
        </div>
      )}

      {/* Footer */}
      <div className="product-footer">
        <button 
          className={`select-button ${isSelected ? 'remove' : 'add'}`}
          onClick={handleSelect}
        >
          {isSelected ? '✓ Selected' : '+ Select'}
        </button>
        <button 
          className="learn-more-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Less' : 'Details'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
