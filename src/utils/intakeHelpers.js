// Merge new answers with existing ones, filtering out empty values
export const mergeAnswers = (existing, incoming) => {
  return {
    ...existing,
    ...Object.fromEntries(
      Object.entries(incoming).filter(([_, value]) => {
        return value !== null && value !== undefined && value !== '';
      })
    )
  };
};

// Get list of fields that haven't been answered yet
export const getMissingFields = (answers, requiredFields) => {
  return requiredFields.filter(field => !answers[field]);
};

// Get the next question to ask based on missing fields
export const getNextQuestion = (
  answers,
  requiredFields,
  questions
) => {
  const missing = getMissingFields(answers, requiredFields);

  if (missing.length === 0) {
    return null;
  }

  return {
    field: missing[0],
    question: questions[missing[0]]
  };
};
