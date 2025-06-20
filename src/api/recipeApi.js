export async function getItemRecipes(item_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgGetItemRecipes/${item_id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get item ${item_id}`);
  }

  return await response.json();
}
