import React, { useState, useCallback, useRef, useEffect } from 'react';
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

import { quickExtract } from './utils/quickExtract';

function App() {
  const [messages, setMessages] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [hasGeneratedFirstRecommendation, setHasGeneratedFirstRecommendation] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'assistant',
        content: 'Welcome! Lets find the perfect Vehicle Protection Products for your vehicle.'
      }]);
    }
  }, []);

  // Format collected answers into a natural language string
  const formatAnswersToString = (answers) => {
    const parts = [];
    
    if (answers.vehicleType) parts.push(`Vehicle Type: ${answers.vehicleType}`);
    if (answers.monthlyBudget) parts.push(`Monthly Budget: ${answers.monthlyBudget}`);
    if (answers.vehicleCondition) parts.push(`Condition: ${answers.vehicleCondition}`);
    if (answers.ownershipDuration) parts.push(`Ownership Duration: ${answers.ownershipDuration}`);
    if (answers.drivingHabits) parts.push(`Driving Habits: ${answers.drivingHabits}`);
    
    return parts.length > 0 
      ? `Based on my information - ${parts.join(', ')}`
      : '';
  };

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

  // Send message to API
  const generateRecommendations = useCallback(async (data, isFirstCall = true) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('https://kns3hffcua.execute-api.us-east-1.amazonaws.com/vpp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      // Parse the response
      let parsedResponse;

      if (apiResponse.body) {
        try {
          let bodyParsed = apiResponse.body;
          
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
            
            parsedResponse = normalizeRecommendations(responseParsed);
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.error('Raw body:', apiResponse.body);
          setError('Failed to parse API response');
          setIsLoading(false);
          return;
        }
      }

      console.log('Full API Response:', apiResponse);
      console.log('Parsed Response:', parsedResponse);

      // Extract summary from response
      const summary = parsedResponse?.summary || 
                      parsedResponse?.message ||
                      'Here are some recommendations based on your preferences.';

      // Add assistant response
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: summary
        }
      ]);

      // Save recommendations
      if (parsedResponse) {
        console.log('Setting recommendations:', parsedResponse);
        setRecommendations(parsedResponse);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Recommendation API error:', err);
      setError(err.message);
      
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: 'Sorry, something went wrong. Please try again.'
        }
      ]);
      
      setIsLoading(false);
    }
  }, []);

  // Handle user message submission
  const handleSendMessage = async (messageText) => {
    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: messageText
    };
    setMessages(prev => [...prev, userMessage]);

    // STEP 1 — Quick Extraction
    let extracted = quickExtract(messageText);

    // STEP 2 — Determine if LLM needed
    const quickMissing = getMissingFields(
      extracted,
      REQUIRED_FIELDS
    );

    // STEP 3 — Merge answers
    const updatedAnswers = mergeAnswers(
      answers,
      extracted
    );

    setAnswers(updatedAnswers);

    console.log('Updated Answers:', updatedAnswers);

    // STEP 4 — Check missing fields
    const missingFields = getMissingFields(
      updatedAnswers,
      REQUIRED_FIELDS
    );

    // STEP 5 — If complete -> call recommendation LLM
    if (missingFields.length === 0 && !hasGeneratedFirstRecommendation) {
      const consolidatedMessage = formatAnswersToString(updatedAnswers);
      console.log('Compiled Prompt:', consolidatedMessage);
      await generateRecommendations(consolidatedMessage, true);
      setHasGeneratedFirstRecommendation(true);
      return;
    }

    // STEP 5b — If recommendations already generated, call API with user input
    if (hasGeneratedFirstRecommendation) {
      await generateRecommendations(messageText, false);
      return;
    }

    // STEP 6 — Ask next missing question
    const nextQuestion = getNextQuestion(
      updatedAnswers,
      REQUIRED_FIELDS,
      QUESTIONS
    );

    if (nextQuestion) {
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: nextQuestion.question
        }
      ]);
    }
  };

  // const generateRecommendations = async (
  //   data,
  //   isFirstCall = true
  // ) => {
  //   try {
  //     setLoading(true);
  //     // Make API call
  //     const response = await fetch('https://kns3hffcua.execute-api.us-east-1.amazonaws.com/vpp', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         message: data
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error(`API error: ${response.status}`);
  //     }

  //     const data = await response.json();
      
  //     // Parse the response
  //     let responseData = {};

  //     if (data.body) {
  //       try {
  //         let bodyParsed = data.body;
          
  //         // If body is a string, parse it
  //         if (typeof bodyParsed === 'string') {
  //           bodyParsed = JSON.parse(bodyParsed);
  //         }
          
  //         // Check if response field exists and is a string
  //         if (bodyParsed.response) {
  //           let responseParsed = bodyParsed.response;
            
  //           // If response is a string, parse it
  //           if (typeof responseParsed === 'string') {
  //             // Remove any markdown code blocks if present
  //             responseParsed = responseParsed.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  //             responseParsed = JSON.parse(responseParsed);
  //           }
            
  //           responseData = normalizeRecommendations(responseParsed);
  //           setRecommendations(responseData);
  //         }
  //       } catch (parseError) {
  //         console.error('Parse error:', parseError);
  //         console.error('Raw body:', data.body);
  //         setError('Failed to parse API response');
  //       }
  //     }
  //   } catch (err) {
  //     console.error('API Error:', err);
  //     setError(err.message);
  //     setIsLoading(false);
      
  //     // Show error message to user
  //     const errorMessage = {
  //       text: "I encountered an error processing your request. Please try again.",
  //       isUser: false,
  //       timestamp: new Date()
  //     };
  //     setMessages(prev => [...prev, errorMessage]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // // Handle user message
  // const handleSendMessage = useCallback((messageText) => {
  //   // Add user message
  //   const userMessage = {
  //     text: messageText,
  //     isUser: true,
  //     timestamp: new Date()
  //   };
  //   setMessages(prev => [...prev, userMessage]);

  //   // Get the current missing field to determine which question was just answered
  //   const currentMissing = getMissingFields(answers, REQUIRED_FIELDS);
  //   const currentField = currentMissing[0];

  //   // Store the answer for the current field
  //   const updatedAnswers = mergeAnswers(answers, {
  //     [currentField]: messageText
  //   });
  //   setAnswers(updatedAnswers);

  //   // Check if all required fields are now filled
  //   const remainingMissing = getMissingFields(updatedAnswers, REQUIRED_FIELDS);

  //   if (remainingMissing.length === 0 && !hasGeneratedFirstRecommendation) {
  //     // All questions answered - send to API
  //     setHasGeneratedFirstRecommendation(true);
      
  //     // Add confirmation message
  //     const confirmMessage = {
  //       text: "Thank you for providing all the information! Let me analyze your preferences and find the perfect Vehicle Protection Products for you...",
  //       isUser: false,
  //       timestamp: new Date()
  //     };
  //     setMessages(prev => [...prev, confirmMessage]);
      
  //     // Send to API with updated answers
  //     sendMessageToAPI();
  //   } else if (remainingMissing.length > 0) {
  //     // Ask the next missing question
  //     const nextQuestion = getNextQuestion(updatedAnswers, REQUIRED_FIELDS, QUESTIONS);
  //     if (nextQuestion) {
  //       const questionMessage = {
  //         text: nextQuestion.question,
  //         isUser: false,
  //         timestamp: new Date()
  //       };
  //       setMessages(prev => [...prev, questionMessage]);
  //     }
  //   }
  // }, [answers, hasGeneratedFirstRecommendation, sendMessageToAPI]);

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
          messagesEndRef={messagesEndRef}
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
