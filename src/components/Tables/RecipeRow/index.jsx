import React from 'react';
import './RecipeRow.css';

function RecipeRow({ recipe, ingredients, onIngredientClick }) {
  const ingredientText = ingredients.map((ing, index) => (
    <>
      <span
        key={ing.id}
        className="ingredient-entry clickable-ingredient"
        onClick={() => onIngredientClick(ing.id)}
        title={`View ${ing.name}`}
      >
        {ing.name}
      </span>
      <span>{index < ingredients.length - 1 ? ', ' : ''}</span>
    </>
  ));

  return (
    <tr className="recipe-row">
      <td className="recipe-cell">
        <span className="recipe-line">
          {ingredientText}
          <span className="recipe-meta">
            {' · '}
            {recipe.production_time} sec
            {' · '}
            {recipe.cooking_description}
          </span>
        </span>
      </td>
      <td className="recipe-cell actions-cell">{/* Optional future icons */}</td>
    </tr>
  );
}

export default RecipeRow;
