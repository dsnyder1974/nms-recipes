import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSpinner, FaStar, FaRegStar } from 'react-icons/fa';
import './RecipeRow.css';

function RecipeRow({
  recipe,
  ingredients,
  onIngredientClick,
  onEdit,
  onDelete,
  isDeleting,
  isPreferred,
  onTogglePreferred,
}) {
  const [savingPreferred, setSavingPreferred] = useState(false);

  const handleTogglePreferred = async (recipe) => {
    setSavingPreferred(true);
    try {
      await onTogglePreferred(recipe);
    } catch (error) {
      console.error('Failed to toggle preferred state', error);
    } finally {
      setSavingPreferred(false);
    }
  };

  const ingredientText = ingredients.map((ing, index) => (
    <React.Fragment key={ing.id}>
      <span
        className="ingredient-entry clickable-ingredient"
        onClick={() => onIngredientClick(ing.id)}
        title={`View ${ing.name}`}
      >
        {ing.name}
      </span>
      <span>{index < ingredients.length - 1 ? ', ' : ''}</span>
    </React.Fragment>
  ));

  return (
    <tr className="recipe-row">
      <td className="recipe-cell">
        <>
          {ingredientText}
          <span className="recipe-meta">
            {' · '}
            {recipe.production_time} sec
            {' · '}
            {recipe.cooking_description}
          </span>
        </>
      </td>
      <td className="recipe-actions-cell">
        <div className="recipe-actions-aligner">
          {isDeleting ? (
            <span className="saving-indicator">
              <FaSpinner className="spinner" /> Deleting...
            </span>
          ) : (
            <>
              {savingPreferred ? (
                <span className="saving-indicator">
                  <FaSpinner className="spinner" />
                </span>
              ) : (
                <button
                  onClick={() => handleTogglePreferred(recipe)}
                  className="icon-button icon-button-star"
                  title={isPreferred ? 'Unmark as Preferred' : 'Mark as Preferred'}
                  disabled={isDeleting}
                >
                  {isPreferred ? <FaStar /> : <FaRegStar />}
                </button>
              )}
              <button
                className="icon-button icon-button-edit"
                title="Edit"
                disabled={isDeleting}
                onClick={() => onEdit(recipe)}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(recipe)}
                className="icon-button icon-button-delete"
                title="Delete"
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default RecipeRow;
