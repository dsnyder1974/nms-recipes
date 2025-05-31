import { useState } from 'react';
import './CategoryRow.css';
import { patchCategory } from '../../../api/categoryApi';

function CategoryRow({ category, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState({ ...category });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await patchCategory(editedCategory.id, {
        name: editedCategory.name,
        image: editedCategory.image,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedCategory({ ...category });
    setIsEditing(false);
  };

  return (
    <tr className={`category-row ${isSaving ? 'saving-row' : ''}`}>
      <td>{category.id}</td>

      <td className={isEditing ? 'editing-cell' : ''}>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedCategory.name}
            onChange={handleChange}
            className="category-row-input"
          />
        ) : (
          category.name
        )}
      </td>

      <td className={isEditing ? 'editing-cell' : ''}>
        {isEditing ? (
          <input
            type="text"
            name="image"
            value={editedCategory.image}
            onChange={handleChange}
            className="category-row-input"
          />
        ) : category.image ? (
          <img src={category.image} alt={category.name} className="category-image" />
        ) : (
          <span className="no-image">No image</span>
        )}
      </td>

      <td>
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} disabled={isSaving}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </td>
    </tr>
  );
}

export default CategoryRow;
