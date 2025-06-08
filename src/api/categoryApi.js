// This file contains functions to interact with the category API.

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

export async function patchCategory(updatedCategory) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgCategory/${updatedCategory.category_id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedCategory.name,
        description: updatedCategory.description ?? null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update category');
  }

  return await response.json();
}

export async function postCategory(updates) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgCategory`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to post new category ${updates.name}`);
  }

  return await response.json();
}

export async function deleteCategory(category_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgCategory/${category_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to patch category ${category_id}`);
  }

  return await response.json();
}
