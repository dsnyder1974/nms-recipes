// This file contains functions to interact with the Item API.

export const fetchItems = async () => {
  const response = await fetch(
    'https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgItems'
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export async function getItemWithCategories(item_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgGetItemWithCategories/${item_id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get item ${item_id}`);
  }

  return await response.json();
}

export async function patchItem(updatedItem) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgItem/${updatedItem.item_id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedItem.name,
        description: updatedItem.description ?? null,
        buff_id: updatedItem.buff_id ?? null,
        buff_bonus_text: updatedItem.buff_bonus_text ?? null,
        buff_duration_minutes: updatedItem.buff_duration_minutes ?? null,
        image_url: updatedItem.image_url ?? null,
        value: updatedItem.value ?? 0,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update item');
  }
  console.log('Item updated successfully:', response);
  return await response.json();
}

export async function postItem(newItem) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgItem`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to post new item ${newItem.name}`);
  }

  return await response.json();
}

export async function deleteItem(item_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgItem/${item_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete item ${item_id}`);
  }

  return await response.json();
}

export async function getIngredientsForItem(item_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgGetIngredientsForItem/${item_id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get ingredients for item ${item_id}`);
  }

  return await response.json();
}
