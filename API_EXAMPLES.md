# API Examples - Find My VPP

This document provides detailed API integration examples for the Find My VPP application.

## Chat Endpoint

### URL
```
POST /api/chat
```

### Headers
```
Content-Type: application/json
```

### Request Format

```json
{
  "message": "User's response text"
}
```

### Response Format

```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{...JSON string with recommendations...}"
}
```

## Complete Response Example

Here's a full example of the API response structure that the application expects:

```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"response\": \"{\\n  \\\"summary\\\": \\\"Based on your long-term ownership and low mileage, here are tailored Vehicle Protection Product recommendations to safeguard your car for over 10 years.\\\",\\n\\n  \\\"individual_recommendations\\\": [\\n    {\\n      \\\"product_name\\\": \\\"Ceramic Paint Guard\\\",\\n      \\\"product_category\\\": \\\"Paint Protection\\\",\\n      \\\"provider\\\": \\\"ShineMax Auto Care\\\",\\n      \\\"plan_name\\\": \\\"Ceramic Silver 84\\\",\\n      \\\"recommended_term_months\\\": 84,\\n      \\\"monthly_cost\\\": 18.99,\\n      \\\"retail_cost\\\": 1593.12,\\n      \\\"is_taxable\\\": true,\\n      \\\"coverage_level\\\": \\\"Appearance Protection\\\",\\n      \\\"why_recommended\\\": \\\"Protects vehicle paint against oxidation, fading, bird droppings, tree sap, and environmental damage.\\\",\\n      \\\"top_benefits\\\": [\\n        \\\"Protects against environmental damage\\\",\\n        \\\"Enhances vehicle appearance\\\"\\n      ],\\n      \\\"best_for\\\": \\\"Long-term vehicle owners with low mileage\\\"\\n    },\\n    {\\n      \\\"product_name\\\": \\\"Road Hazard Tire Shield\\\",\\n      \\\"product_category\\\": \\\"Tire and Wheel Protection\\\",\\n      \\\"provider\\\": \\\"DriveCare Solutions\\\",\\n      \\\"plan_name\\\": \\\"Tire Shield 84\\\",\\n      \\\"recommended_term_months\\\": 84,\\n      \\\"monthly_cost\\\": 21.99,\\n      \\\"retail_cost\\\": 1847.16,\\n      \\\"is_taxable\\\": true,\\n      \\\"coverage_level\\\": \\\"Component Protection\\\",\\n      \\\"why_recommended\\\": \\\"Covers repair or replacement of tires and wheels damaged by road hazards.\\\",\\n      \\\"top_benefits\\\": [\\n        \\\"Covers tires and wheels\\\",\\n        \\\"Protects against road hazards\\\"\\n      ],\\n      \\\"best_for\\\": \\\"Long-term vehicle owners with low mileage\\\"\\n    }\\n  ],\\n\\n  \\\"recommended_packages\\\": [\\n    {\\n      \\\"package_name\\\": \\\"Long-Term Vehicle Care Package\\\",\\n      \\\"package_type\\\": \\\"Premium\\\",\\n      \\\"recommended_for\\\": \\\"Customers planning to retain their vehicle for over 10 years with low mileage\\\",\\n      \\\"package_total_monthly_cost\\\": 40.98,\\n      \\\"package_total_retail_cost\\\": 3440.28,\\n      \\\"overall_benefits\\\": [\\n        \\\"Comprehensive protection for paint and tires/wheels\\\",\\n        \\\"Long-term coverage\\\"\\n      ],\\n      \\\"products\\\": [\\n        {\\n          \\\"product_name\\\": \\\"Ceramic Paint Guard\\\",\\n          \\\"product_category\\\": \\\"Paint Protection\\\",\\n          \\\"provider\\\": \\\"ShineMax Auto Care\\\",\\n          \\\"plan_name\\\": \\\"Ceramic Silver 84\\\",\\n          \\\"recommended_term_months\\\": 84,\\n          \\\"monthly_cost\\\": 18.99,\\n          \\\"retail_cost\\\": 1593.12,\\n          \\\"is_taxable\\\": true,\\n          \\\"coverage_level\\\": \\\"Appearance Protection\\\",\\n          \\\"why_recommended\\\": \\\"Protects vehicle paint against oxidation, fading, bird droppings, tree sap, and environmental damage.\\\",\\n          \\\"top_benefits\\\": [\\n            \\\"Protects against environmental damage\\\",\\n            \\\"Enhances vehicle appearance\\\"\\n          ]\\n        },\\n        {\\n          \\\"product_name\\\": \\\"Road Hazard Tire Shield\\\",\\n          \\\"product_category\\\": \\\"Tire and Wheel Protection\\\",\\n          \\\"provider\\\": \\\"DriveCare Solutions\\\",\\n          \\\"plan_name\\\": \\\"Tire Shield 84\\\",\\n          \\\"recommended_term_months\\\": 84,\\n          \\\"monthly_cost\\\": 21.99,\\n          \\\"retail_cost\\\": 1847.16,\\n          \\\"is_taxable\\\": true,\\n          \\\"coverage_level\\\": \\\"Component Protection\\\",\\n          \\\"why_recommended\\\": \\\"Covers repair or replacement of tires and wheels damaged by road hazards.\\\",\\n          \\\"top_benefits\\\": [\\n            \\\"Covers tires and wheels\\\",\\n            \\\"Protects against road hazards\\\"\\n          ]\\n        }\\n      ]\\n    }\\n  ],\\n\\n  \\\"follow_up_question\\\": \\\"Would you like more information on any of these recommendations or help with the enrollment process?\\\"\\n}\"}"
}
```

## Request Examples

### JavaScript/Fetch

```javascript
const sendMessage = async (messageText) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageText
      })
    });

    const data = await response.json();
    
    // Parse nested JSON structure
    const bodyParsed = JSON.parse(data.body);
    const recommendationsData = JSON.parse(bodyParsed.response);
    
    console.log('Summary:', recommendationsData.summary);
    console.log('Products:', recommendationsData.individual_recommendations);
    console.log('Packages:', recommendationsData.recommended_packages);
    
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Axios

```javascript
import axios from 'axios';

const sendMessage = async (messageText) => {
  try {
    const response = await axios.post('/api/chat', {
      message: messageText
    });

    const bodyData = JSON.parse(response.data.body);
    const recommendations = JSON.parse(bodyData.response);
    
    return recommendations;
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### cURL

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I own a 2020 sedan and drive about 5000 miles per year"}'
```

## Response Parsing

The response requires double parsing due to nested JSON strings:

```javascript
// Step 1: Parse outer response
const outerData = JSON.parse(apiResponse.body);

// Step 2: Parse inner response string
const innerData = JSON.parse(outerData.response);

// Now you have access to:
// - innerData.summary
// - innerData.individual_recommendations[]
// - innerData.recommended_packages[]
// - innerData.follow_up_question
```

## Product Object Structure

Each product object contains:

```json
{
  "product_name": "Product Name",
  "product_category": "Category Type",
  "provider": "Provider Company Name",
  "plan_name": "Specific Plan Name",
  "recommended_term_months": 84,
  "monthly_cost": 18.99,
  "retail_cost": 1593.12,
  "is_taxable": true,
  "coverage_level": "Type of Coverage",
  "why_recommended": "Explanation of why this product is recommended",
  "top_benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "best_for": "Target customer profile"
}
```

## Package Object Structure

Package objects bundle multiple products:

```json
{
  "package_name": "Package Name",
  "package_type": "Premium|Standard|Basic",
  "recommended_for": "Target customer description",
  "package_total_monthly_cost": 40.98,
  "package_total_retail_cost": 3440.28,
  "overall_benefits": ["Benefit 1", "Benefit 2"],
  "products": [/* Product objects */]
}
```

## Error Handling

### Common Response Codes

- **200**: Successful request with recommendations
- **400**: Invalid request format
- **500**: Server error processing request

### Error Response Example

```json
{
  "statusCode": 500,
  "headers": {
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"error\": \"Failed to generate recommendations\"}"
}
```

## Testing the API

### Test with Sample Message

```javascript
const testMessage = "I drive a 2022 Honda CR-V, own it, and plan to keep it for 10+ years";

fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: testMessage })
})
.then(r => r.json())
.then(data => {
  const response = JSON.parse(JSON.parse(data.body).response);
  console.log(response);
})
.catch(err => console.error(err));
```

## Integration Checklist

- [ ] API endpoint is accessible and running
- [ ] CORS is properly configured
- [ ] Request format matches specification
- [ ] Response parsing handles nested JSON
- [ ] Error handling catches API failures
- [ ] Messages are properly formatted strings
- [ ] Products display with all required fields
- [ ] Selected products are tracked correctly

## Rate Limiting

The API should implement rate limiting to prevent abuse:
- Recommended: 10 requests per minute per user
- Use backoff strategy for retries

## Response Time Expectations

- Initial recommendation: 2-5 seconds
- Subsequent messages: 1-3 seconds
- Consider showing typing indicator during processing

---

For integration support or issues, check the application console for error details and verify API endpoint configuration.
