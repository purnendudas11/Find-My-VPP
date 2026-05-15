export const quickExtract = (input) => {
  const lower = input.toLowerCase();
  const result = {};

  // Vehicle Type extraction
  if (lower.includes('sedan')) {
    result.vehicleType = 'Sedan';
  } else if (lower.includes('suv')) {
    result.vehicleType = 'SUV';
  } else if (lower.includes('truck')) {
    result.vehicleType = 'Truck';
  } else if (lower.includes('coupe')) {
    result.vehicleType = 'Coupe';
  } else if (lower.includes('van')) {
    result.vehicleType = 'Van';
  } else if (lower.includes('wagon')) {
    result.vehicleType = 'Wagon';
  }

  // Monthly Budget extraction
  const budgetMatch = input.match(/\$?\d{2,4}(?:\s*(?:to|-|–)\s*\$?\d{2,4})?|\$?\d{1,3}[,]\d{3}/);
  if (budgetMatch) {
    result.monthlyBudget = budgetMatch[0];
  }

  // Vehicle Condition extraction
  if (lower.includes('used')) {
    result.vehicleCondition = 'Used';
  } else if (lower.includes('new')) {
    result.vehicleCondition = 'New';
  }

  // Ownership Duration extraction
  if (lower.includes('5 years') || lower.includes('five years')) {
    result.ownershipDuration = '5 years';
  } else if (lower.includes('3 years') || lower.includes('three years')) {
    result.ownershipDuration = '3 years';
  } else if (lower.includes('2 years') || lower.includes('two years')) {
    result.ownershipDuration = '2 years';
  } else if (lower.includes('1 year') || lower.includes('one year') || lower.includes('just bought')) {
    result.ownershipDuration = '1 year';
  } else if (lower.includes('long term')) {
    result.ownershipDuration = 'Long term';
  } else if (lower.includes('short term')) {
    result.ownershipDuration = 'Short term';
  }

  // Driving Habits extraction
  if (lower.includes('commute') || lower.includes('daily')) {
    result.drivingHabits = 'Daily commute';
  } else if (lower.includes('weekend')) {
    result.drivingHabits = 'Weekend trips';
  } else if (lower.includes('highway')) {
    result.drivingHabits = 'Highway miles';
  } else if (lower.includes('city')) {
    result.drivingHabits = 'City driving';
  } else if (lower.includes('mixed')) {
    result.drivingHabits = 'Mixed driving';
  } else if (lower.includes('off-road') || lower.includes('offroad')) {
    result.drivingHabits = 'Off-road';
  }

  return result;
};
