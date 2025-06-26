import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import './RecipeEditDialog.css';

function RecipeEditDialog({ recipe, allItems, onSave, onCancel }) {
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const dialogRef = useRef(null);

  useEffect(() => {
    setEditedRecipe(recipe);
  }, [recipe]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    const handleClickOutside = (e) => {
      const isSelectComponent = e.target.closest('[class^="react-select__"]');
      // Don't close if click target is inside a react-select menu or control
      if (dialogRef.current && !dialogRef.current.contains(e.target) && !isSelectComponent) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  const handleChange = (field, value) => {
    setEditedRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    onSave(editedRecipe);
  };

  const renderIngredientSelect = (field, nullable = false) => {
    const baseOptions = allItems.map((item) => ({
      value: item.item_id,
      label: item.name,
    }));
    const options = nullable ? [{ value: null, label: '-- None --' }, ...baseOptions] : baseOptions;

    return (
      <Select
        classNamePrefix="react-select"
        value={
          options.find((opt) => opt.value === editedRecipe[field]) || (nullable ? options[0] : null)
        }
        onChange={(selected) => handleChange(field, selected?.value || null)}
        options={options}
        isClearable
        placeholder="Select item..."
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '36px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxShadow: 'none',
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          valueContainer: (base) => ({ ...base, padding: '0 8px' }),
        }}
      />
    );
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog" ref={dialogRef}>
        <h3>Edit Recipe</h3>

        <div className="dialog-section">
          <label>Ingredient 1:</label>
          {renderIngredientSelect('ingredient1_id', false)}
        </div>
        <div className="dialog-section">
          <label>Ingredient 2:</label>
          {renderIngredientSelect('ingredient2_id', true)}
        </div>
        <div className="dialog-section">
          <label>Ingredient 3:</label>
          {renderIngredientSelect('ingredient3_id', true)}
        </div>

        <div className="dialog-section">
          <label>Production Time (sec):</label>
          <input
            type="number"
            value={editedRecipe.production_time || ''}
            onChange={(e) => handleChange('production_time', parseFloat(e.target.value))}
          />
        </div>

        <div className="dialog-section">
          <label>Cooking Description:</label>
          <input
            type="text"
            value={editedRecipe.cooking_description || ''}
            onChange={(e) => handleChange('cooking_description', e.target.value)}
          />
        </div>

        <div className="dialog-buttons">
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeEditDialog;
