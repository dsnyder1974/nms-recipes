export async function getItemRecipes(item_id) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgGetItemRecipes/${item_id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get item ${item_id}`);
  }

  return await response.json();
}

export async function patchRecipe(updatedRecipe) {
  const response = await fetch(
    `https://7selh9jd9i.execute-api.us-east-2.amazonaws.com/dev/pgRecipe/${updatedRecipe.recipe_id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        production_time: updatedRecipe.production_time ?? 0,
        cooking_description: updatedRecipe.cooking_description ?? '',
        ingredient1_id: updatedRecipe.ingredient1_id,
        ingredient2_id: updatedRecipe.ingredient2_id ?? null,
        ingredient3_id: updatedRecipe.ingredient3_id ?? null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update item');
  }
  console.log('Item updated successfully:', response);
  return await response.json();
}
