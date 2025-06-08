import { useState } from 'react';
import './DataTable.css';
import { FaSpinner } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';

function DataRow({ item, columns, onUpdate, onDelete, getId }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingField, setEditingField] = useState(null);
  const [editedFields, setEditedFields] = useState(
    columns.reduce((acc, col) => {
      acc[col.field] = item[col.field] ?? '';
      return acc;
    }, {})
  );

  const handleSaveField = async (field, value) => {
    const column = columns.find((col) => col.field === field);

    if (column?.required && !value.trim()) {
      console.error(`Field "${column.label}" is required.`);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate({
        ...item,
        [field]: value,
      });
      setEditedFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    } catch (err) {
      console.error(`Failed to update field ${field}:`, err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name || getId(item)}"?`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(getId(item));
    } catch (err) {
      console.error('Failed to delete item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr className={`category-row ${isSaving ? 'saving-row' : ''}`}>
      {columns.map((col) => (
        <td
          key={col.field}
          onClick={() => col.editable && setEditingField(col.field)}
          className={editingField === col.field ? 'editing-cell' : ''}
          style={col.width ? { width: col.width } : {}}
        >
          {col.editable && editingField === col.field ? (
            <div className="cell-flex">
              <input
                type="text"
                value={editedFields[col.field]}
                autoFocus
                onChange={(e) => setEditedFields({ ...editedFields, [col.field]: e.target.value })}
                onBlur={async (e) => {
                  const newValue = e.target.value.trim();
                  if (newValue !== item[col.field]) {
                    await handleSaveField(col.field, newValue);
                  }
                  setEditingField(null);
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  } else if (e.key === 'Escape') {
                    setEditingField(null);
                    setEditedFields((prev) => ({
                      ...prev,
                      [col.field]: item[col.field] ?? '',
                    }));
                  }
                }}
                className={`category-row-input ${
                  col.required && !editedFields[col.field]?.trim?.() ? 'input-error' : ''
                }`}
                disabled={isSaving}
                placeholder={`Enter ${col.label}`}
              />
            </div>
          ) : item[col.field] ? (
            <span>{item[col.field]}</span>
          ) : (
            <span className="no-value">No Value</span>
          )}
        </td>
      ))}

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

export default DataRow;
