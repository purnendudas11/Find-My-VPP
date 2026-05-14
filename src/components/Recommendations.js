import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const Recommendations = ({ 
  recommendations = {}, 
  selectedProducts = [], 
  onSelectProduct,
  isLoading = false 
}) => {
  // Flatten all products from individual_recommendations and recommended_packages
  const allProducts = useMemo(() => {
    const products = [];
    
    if (recommendations.individual_recommendations) {
      recommendations.individual_recommendations.forEach(rec => {
        if (!products.find(p => p.product_name === rec.product_name && p.plan_name === rec.plan_name)) {
          products.push({ ...rec, isRecommendedIndividually: true });
        }
      });
    }
    
    if (recommendations.recommended_packages) {
      recommendations.recommended_packages.forEach(pkg => {
        if (pkg.products) {
          pkg.products.forEach(product => {
            if (!products.find(p => p.product_name === product.product_name && p.plan_name === product.plan_name)) {
              products.push({ ...product, packageName: pkg.package_name });
            }
          });
        }
      });
    }
    
    return products;
  }, [recommendations]);

  const selectedCount = selectedProducts.length;
  const totalMonthly = useMemo(() => {
    return selectedProducts.reduce((sum, product) => {
      const cost = typeof product.monthly_cost === 'string' 
        ? parseFloat(product.monthly_cost) 
        : product.monthly_cost;
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0);
  }, [selectedProducts]);

  return (
    <div className="recommendations-section">
      {/* Header */}
      <div className="recommendations-header">
        <h2>Recommended VPP Products</h2>
        {selectedCount > 0 && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {selectedCount} selected • ${totalMonthly.toFixed(2)}/month
          </p>
        )}
      </div>

      {/* Content */}
      <div className="recommendations-content">
        {isLoading && allProducts.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LoadingSpinner text="Finding recommendations" />
          </div>
        ) : allProducts.length === 0 ? (
          <div className="recommendations-empty">
            <p>Answer a few questions to get personalized recommendations</p>
          </div>
        ) : (
          <>
            {recommendations.summary && (
              <div className="recommendations-summary">
                <p>{recommendations.summary}</p>
              </div>
            )}
            {allProducts.map((product, idx) => (
              <ProductCard
                key={`${product.product_name}-${product.plan_name}-${idx}`}
                product={product}
                isSelected={selectedProducts.some(
                  p => p.product_name === product.product_name && p.plan_name === product.plan_name
                )}
                onSelect={onSelectProduct}
                isRecommended={product.isRecommendedIndividually === true}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
