import { useState } from 'react';
import './CategoryRow.css';
import { FaSpinner } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';

function CategoryRow({ category, onUpdate, onDelete }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Per-field edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Editable field values
  const [editedName, setEditedName] = useState(category.name);
  const [editedDescription, setEditedDescription] = useState(category.description || '');

  const handleSaveField = async (field, value) => {
    setIsSaving(true);
    try {
      await onUpdate({
        ...category,
        [field]: value,
      });
    } catch (err) {
      console.error(`Failed to update category ${field}:`, err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete category "${category.name}"?`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(category.category_id);
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr className={`category-row ${isSaving ? 'saving-row' : ''}`}>
      <td>{category.category_id}</td>

      {/* NAME FIELD */}
      <td onClick={() => setIsEditingName(true)} className={isEditingName ? 'editing-cell' : ''}>
        {isEditingName ? (
          <input
            type="text"
            value={editedName}
            autoFocus
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={async (e) => {
              const newValue = e.target.value.trim();
              if (newValue && newValue !== category.name) {
                await handleSaveField('name', newValue);
              }
              setIsEditingName(false);
            }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.target.blur();
              } else if (e.key === 'Escape') {
                setIsEditingName(false);
                setEditedName(category.name); // reset
              }
            }}
            className="category-row-input"
            disabled={isSaving}
          />
        ) : (
          category.name
        )}
      </td>

      {/* DESCRIPTION FIELD */}
      <td
        onClick={() => setIsEditingDescription(true)}
        className={isEditingDescription ? 'editing-cell' : ''}
      >
        {isEditingDescription ? (
          <input
            type="text"
            value={editedDescription}
            autoFocus
            onChange={(e) => setEditedDescription(e.target.value)}
            onBlur={async (e) => {
              const newValue = e.target.value.trim();
              if (newValue !== category.description) {
                await handleSaveField('description', newValue);
              }
              setIsEditingDescription(false);
            }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.target.blur();
              } else if (e.key === 'Escape') {
                setIsEditingDescription(false);
                setEditedDescription(category.description || ''); // reset
              }
            }}
            className="category-row-input"
            disabled={isSaving}
          />
        ) : category.description ? (
          <span className="category-description">{category.description}</span>
        ) : (
          <span className="no-image">No Description</span>
        )}
      </td>

      {/* ACTION BUTTONS */}
      <td>
        <button
          onClick={handleDelete}
          disabled={isSaving || isDeleting}
          title="Delete"
          className={isDeleting ? 'deleting-button' : isSaving ? 'saving-button' : ''}
        >
          {isDeleting ? (
            <FaSpinner className="icon-spin red-spinner" />
          ) : isSaving ? (
            <FaSpinner className="icon-spin green-spinner" />
          ) : (
            <FiTrash2 />
          )}
        </button>
      </td>
    </tr>
  );
}

export default CategoryRow;
