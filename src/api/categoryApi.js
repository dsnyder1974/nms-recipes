// src/api/tags.js

export const fetchCategories = async () => {
  const response = await fetch(
    'https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgCategories'
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export async function patchCategory(id, updates) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgCategory/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to patch category ${id}`);
  }

  return await response.json();
}
