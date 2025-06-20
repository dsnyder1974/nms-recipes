import React from 'react';
import './RecipeRow.css';

function RecipeRow({ recipe, onIngredientClick }) {
  return (
    <tr className="recipe-row">
      <td className="recipe-cell">
        <div className="ingredients-list">
          {recipe.ingredients.map(
            (ing, index) => (
              console.log(`Rendering ingredient: ${ing.input_item_id}`),
              (
                <span
                  key={index}
                  className="ingredient-entry clickable-ingredient"
                  onClick={() => onIngredientClick(ing.input_item_id)}
                  title={`View ${ing.input_name}`}
                >
                  {ing.quantity} × {ing.input_name}
                  {index < recipe.ingredients.length - 1 && ', '}
                </span>
              )
            )
          )}
        </div>
      </td>
      <td className="recipe-cell">{recipe.production_time} min</td>
      <td className="recipe-cell">
        <div className="recipe-description">{recipe.cooking_description}</div>
      </td>
    </tr>
  );
}

export default RecipeRow;
