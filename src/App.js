import React, { useState, useCallback, useRef } from 'react';
import Chat from './components/Chat';
import Recommendations from './components/Recommendations';
import './App.css';

// Initial questions for the questionnaire
const INITIAL_QUESTIONS = [
  "Welcome! Let's find the perfect Vehicle Protection Products for your vehicle. First, what type of vehicle do you own? (e.g., sedan, SUV, truck)",
  "Great! What's your typical monthly budget for protection plans?",
  "Is your vehicle new or used?",
  "What's your preferred monthly payment range?",
  "How long do you plan to keep or own this vehicle?",
  "Can you describe your typical driving habits? (e.g., daily commute, weekend trips, highway miles)"
];

function App() {
  const [messages, setMessages] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const questionIndexRef = useRef(0);

  // Add initial greeting message when component mounts
  React.useEffect(() => {
    const greeting = {
      text: INITIAL_QUESTIONS[0],
      isUser: false,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  // Send message to API
  const sendMessageToAPI = useCallback(async (messageText) => {
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

      // Make API call
      const response = await fetch('https://kns3hffcua.execute-api.us-east-1.amazonaws.com/vpp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText
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

      // Add follow-up question to chat if available
      if (responseData.follow_up_question && questionIndexRef.current < INITIAL_QUESTIONS.length - 1) {
        questionIndexRef.current += 1;
        const nextQuestion = {
          text: INITIAL_QUESTIONS[questionIndexRef.current],
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuestion]);
      } else if (responseData.follow_up_question) {
        const followUp = {
          text: responseData.follow_up_question,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, followUp]);
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
  }, []);

  // Handle user message
  const handleSendMessage = useCallback((messageText) => {
    // Add user message
    const userMessage = {
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to API
    sendMessageToAPI(messageText);
  }, [sendMessageToAPI]);

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
