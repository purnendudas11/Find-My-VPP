import React, { useState, useCallback } from 'react';
import Chat from './components/Chat';
import Recommendations from './components/Recommendations';
import './App.css';

import {
  QUESTIONS,
  REQUIRED_FIELDS
} from './config/questions';

import {
  mergeAnswers,
  getMissingFields,
  getNextQuestion
} from './utils/intakeHelpers';

function App() {
  const [messages, setMessages] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [hasGeneratedFirstRecommendation, setHasGeneratedFirstRecommendation] = useState(false);

  // Add initial greeting message when component mounts
  React.useEffect(() => {
    const firstQuestion = getNextQuestion({}, REQUIRED_FIELDS, QUESTIONS);
    const greeting = {
      text: `Welcome! Let's find the perfect Vehicle Protection Products for your vehicle. ${firstQuestion.question}`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  // Send message to API with all collected responses
  const sendMessageToAPI = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Helper to normalize product numbers
      const normalizeProduct = (product) => ({
        ...product,
        monthly_cost: product.monthly_cost !== null && product.monthly_cost !== undefined 
          ? (typeof product.monthly_cost === 'string' ? parseFloat(product.monthly_cost) : product.monthly_cost)
          : 0,
        retail_cost: product.retail_cost !== null && product.retail_cost !== undefined
          ? (typeof product.retail_cost === 'string' ? parseFloat(product.retail_cost) : product.retail_cost)
          : 0,
        recommended_term_months: product.recommended_term_months !== null && product.recommended_term_months !== undefined
          ? (typeof product.recommended_term_months === 'string' ? parseInt(product.recommended_term_months) : product.recommended_term_months)
          : 0
      });

      // Helper to normalize recommendations
      const normalizeRecommendations = (data) => {
        return {
          ...data,
          individual_recommendations: (data.individual_recommendations || []).map(normalizeProduct),
          recommended_packages: (data.recommended_packages || []).map(pkg => ({
            ...pkg,
            products: (pkg.products || []).map(normalizeProduct)
          }))
        };
      };

      // Compile all answers into a comprehensive prompt
      const compiledPrompt = `Based on the following customer information, please provide Vehicle Protection Product recommendations:

1. Vehicle Type: ${answers.vehicleType || 'Not specified'}
2. Monthly Budget: ${answers.monthlyBudget || 'Not specified'}
3. Vehicle Status: ${answers.vehicleCondition || 'Not specified'}
4. Preferred Monthly Payment: ${answers.paymentRange || 'Not specified'}
5. Ownership Duration: ${answers.ownershipDuration || 'Not specified'}
6. Driving Habits: ${answers.drivingHabits || 'Not specified'}

Please analyze this customer profile and recommend appropriate VPP products that match their needs and budget.`;

      console.log('Compiled Prompt:', compiledPrompt);

      // Make API call
      const response = await fetch('https://kns3hffcua.execute-api.us-east-1.amazonaws.com/vpp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: compiledPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the response
      let responseData = {};

      if (data.body) {
        try {
          let bodyParsed = data.body;
          
          // If body is a string, parse it
          if (typeof bodyParsed === 'string') {
            bodyParsed = JSON.parse(bodyParsed);
          }
          
          // Check if response field exists and is a string
          if (bodyParsed.response) {
            let responseParsed = bodyParsed.response;
            
            // If response is a string, parse it
            if (typeof responseParsed === 'string') {
              // Remove any markdown code blocks if present
              responseParsed = responseParsed.replace(/^```json\n?/, '').replace(/\n?```$/, '');
              responseParsed = JSON.parse(responseParsed);
            }
            
            responseData = normalizeRecommendations(responseParsed);
            setRecommendations(responseData);
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.error('Raw body:', data.body);
          setError('Failed to parse API response');
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      setIsLoading(false);
      
      // Show error message to user
      const errorMessage = {
        text: "I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [answers]);

  // Handle user message
  const handleSendMessage = useCallback((messageText) => {
    // Add user message
    const userMessage = {
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Get the current missing field to determine which question was just answered
    const currentMissing = getMissingFields(answers, REQUIRED_FIELDS);
    const currentField = currentMissing[0];

    // Store the answer for the current field
    const updatedAnswers = mergeAnswers(answers, {
      [currentField]: messageText
    });
    setAnswers(updatedAnswers);

    // Check if all required fields are now filled
    const remainingMissing = getMissingFields(updatedAnswers, REQUIRED_FIELDS);

    if (remainingMissing.length === 0 && !hasGeneratedFirstRecommendation) {
      // All questions answered - send to API
      setHasGeneratedFirstRecommendation(true);
      
      // Add confirmation message
      const confirmMessage = {
        text: "Thank you for providing all the information! Let me analyze your preferences and find the perfect Vehicle Protection Products for you...",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
      
      // Send to API with updated answers
      sendMessageToAPI();
    } else if (remainingMissing.length > 0) {
      // Ask the next missing question
      const nextQuestion = getNextQuestion(updatedAnswers, REQUIRED_FIELDS, QUESTIONS);
      if (nextQuestion) {
        const questionMessage = {
          text: nextQuestion.question,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, questionMessage]);
      }
    }
  }, [answers, hasGeneratedFirstRecommendation, sendMessageToAPI]);

  // Handle product selection
  const handleSelectProduct = useCallback((product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(
        p => p.product_name === product.product_name && p.plan_name === product.plan_name
      );

      if (isSelected) {
        return prev.filter(
          p => !(p.product_name === product.product_name && p.plan_name === product.plan_name)
        );
      } else {
        return [...prev, product];
      }
    });
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <h1>Find My VPP</h1>
          <p>Discover and purchase the right Vehicle Protection Products for your needs</p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="app-layout">
        {/* Chat Section */}
        <Chat 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />

        {/* Recommendations Section */}
        <Recommendations
          recommendations={recommendations}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          isLoading={isLoading}
        />
      </div>

      {/* Error Toast (optional) */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#fee2e2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default App;
