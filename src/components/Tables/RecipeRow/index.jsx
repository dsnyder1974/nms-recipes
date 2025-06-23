import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Select from 'react-select';
import './RecipeRow.css';

function RecipeRow({
  recipe,
  ingredients,
  allItems,
  onIngredientClick,
  onSave,
  onDelete,
  isSaving,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  const itemOptions = allItems.map((item) => ({
    value: item.item_id,
    label: item.name,
  }));
  const nullableItemOptions = [{ value: null, label: 'None' }, ...itemOptions];

  const handleChange = (field, value) => {
    setEditedRecipe((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    await onSave(editedRecipe);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecipe(recipe); // Reset
    setIsEditing(false);
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

  const selectStylesCompact = {
    control: (base) => ({
      ...base,
      height: '38px',
      minHeight: '38px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxShadow: 'none',
    }),
    valueContainer: (base) => ({
      ...base,
      height: '38px',
      padding: '0 10px',
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (base) => ({
      ...base,
      lineHeight: '1',
      alignSelf: 'center',
    }),
    input: (base) => ({
      ...base,
      margin: '0',
      padding: '0',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '38px',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <tr className="recipe-row">
      <td className="recipe-cell">
        {isEditing ? (
          <div className="form-inline recipe-edit-row">
            <div className="ingredient-select-group">
              <label className="form-label">Ingredient 1:</label>
              <Select
                className="ingredient-select"
                value={itemOptions.find((opt) => opt.value === editedRecipe.ingredient1_id) || null}
                onChange={(selected) => handleChange('ingredient1_id', selected?.value || null)}
                options={itemOptions}
                styles={selectStylesCompact}
                isClearable
              />
            </div>
            <div className="ingredient-select-group">
              <label className="form-label">Ingredient 2:</label>
              <Select
                className="ingredient-select"
                value={
                  nullableItemOptions.find((opt) => opt.value === editedRecipe.ingredient2_id) ||
                  null
                }
                onChange={(selected) => handleChange('ingredient2_id', selected?.value || null)}
                options={nullableItemOptions}
                styles={selectStylesCompact}
                isClearable
              />
            </div>
            <div className="ingredient-select-group">
              <label className="form-label">Ingredient 3:</label>
              <Select
                className="ingredient-select"
                value={
                  nullableItemOptions.find((opt) => opt.value === editedRecipe.ingredient3_id) ||
                  null
                }
                onChange={(selected) => handleChange('ingredient3_id', selected?.value || null)}
                options={nullableItemOptions}
                styles={selectStylesCompact}
                isClearable
              />
            </div>

            <label className="form-label">Time:</label>
            <input
              type="number"
              className="form-input small"
              value={editedRecipe.production_time}
              onChange={(e) => handleChange('production_time', parseFloat(e.target.value))}
            />

            <label className="form-label">Description:</label>
            <input
              type="text"
              className="form-input medium"
              value={editedRecipe.cooking_description || ''}
              onChange={(e) => handleChange('cooking_description', e.target.value)}
            />
          </div>
        ) : (
          <>
            {ingredientText}
            <span className="recipe-meta">
              {' · '}
              {recipe.production_time} sec
              {' · '}
              {recipe.cooking_description}
            </span>
          </>
        )}
      </td>
      <td className="recipe-actions-cell">
        <div className="recipe-actions-aligner">
          {isEditing ? (
            isSaving ? (
              <span className="saving-indicator">
                <FaSpinner className="spinner" /> Saving...
              </span>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="save-button recipe-button-margin"
                  title="Save Recipe"
                >
                  <FaSave />
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="cancel-button recipe-button-margin"
                  // className="icon-button icon-button-delete"
                  title="Cancel"
                >
                  <FaTimes /> Cancel
                </button>
              </>
            )
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="icon-button icon-button-edit"
                title="Edit"
                disabled={isSaving}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(recipe)}
                className="icon-button icon-button-delete"
                title="Delete"
                disabled={isSaving}
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
