// This file contains functions to interact with the ItemCategory API.

export const fetchItemsCategories = async () => {
  const response = await fetch(
    'https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgItemsCategories'
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export async function fetchCategoriesByItem(item_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgGetCategoriesByItem/${item_id}`
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export async function patchCategoriesByItem(updatedItem) {
  const categoryIds = (updatedItem.categories ?? []).map((c) => c.category_id);

  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgPatchCategoriesByItem/${updatedItem.item_id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category_ids: categoryIds,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update item');
  }

  return await response.json();
}
