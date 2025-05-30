// src/api/tags.js

export const fetchCategories = async () => {
  const response = await fetch('https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgCategories');
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};
