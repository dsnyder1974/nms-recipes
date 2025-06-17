import { useEffect, useRef, useState } from 'react';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import Select from 'react-select/creatable';
import './ItemEditorCard.css';

function ItemEditorCard({ item, columns, buffs, allCategories, onSave, onCancel, onDelete }) {
  const [editedItem, setEditedItem] = useState(item);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    setEditedItem(item);
    setIsEditing(false);
    setIsDirty(false);
    setIsSaving(false);
    setImageError(false);
  }, [item]);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const confirmDiscardChanges = () => {
    if (isDirty) {
      return window.confirm('You have unsaved changes. Discard them?');
    }
    return true;
  };

  const handleClose = () => {
    if (!isEditing || confirmDiscardChanges()) {
      setIsEditing(false);
      setIsDirty(false);
      setEditedItem(item);
      onCancel();
    }
  };

  const handleCancel = () => {
    if (!isDirty || confirmDiscardChanges()) {
      setEditedItem(item);
      setIsEditing(false);
      setIsDirty(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showImagePopup) return;
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing, isDirty, item, showImagePopup]);

  const handleChange = (field, value) => {
    if (field === 'image_url') {
      setImageError(false);
    }
    setEditedItem((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedItem);
      setIsEditing(false);
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const mainFields = columns.filter((c) => (c.group ?? 'main') === 'main' && c.field !== 'item_id');
  const buffFields = columns.filter((c) => c.group === 'buff');
  const valueFields = columns.filter((c) => c.group === 'value');

  const buffOptions = [
    { value: null, label: 'No Buff' },
    ...buffs.map((b) => ({ value: b.buff_id, label: b.name })),
  ];

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal" ref={modalRef}>
        <button className="close-button" onClick={handleClose} title="Close" aria-label="Close">
          &times;
        </button>

        <div className="editor-card-layout">
          <div className="editor-main">
            {mainFields.map((col) => (
              <div
                key={col.field}
                className={
                  isEditing
                    ? col.field === 'description'
                      ? 'description-input'
                      : 'name-input'
                    : `inline-display ${col.field === 'name' ? 'name-field' : ''}`
                }
              >
                {isEditing ? (
                  <>
                    <label className="field-label" htmlFor={col.field}>
                      {col.label}
                    </label>
                    {col.field === 'description' ? (
                      <textarea
                        id={col.field}
                        className="full-width"
                        value={editedItem[col.field] || ''}
                        onChange={(e) => handleChange(col.field, e.target.value)}
                      />
                    ) : (
                      <input
                        id={col.field}
                        ref={col.field === 'name' ? nameInputRef : null}
                        className="full-width"
                        type="text"
                        value={editedItem[col.field] || ''}
                        onChange={(e) => handleChange(col.field, e.target.value)}
                      />
                    )}
                  </>
                ) : (
                  <span>
                    {editedItem[col.field] || <span className="placeholder">{col.label}</span>}
                  </span>
                )}
              </div>
            ))}

            <div className="buff-info">
              {!isEditing && (
                <div className="buff-label">
                  <strong>Ingestor Buff:</strong>
                </div>
              )}
              {buffFields.map((col) => {
                const isBuffId = col.field === 'buff_id';
                const hasBuff = editedItem.buff_id !== null;

                const value = isBuffId
                  ? buffOptions.find((opt) => opt.value === editedItem.buff_id)?.label || 'No Buff'
                  : editedItem[col.field] || '';

                return (
                  <div key={col.field} className={isEditing ? 'buff-input' : 'inline-display'}>
                    {isEditing ? (
                      <>
                        <label className="field-label" htmlFor={col.field}>
                          {col.label}
                        </label>
                        {isBuffId ? (
                          <Select
                            inputId={col.field}
                            className="buff-select"
                            classNamePrefix="buff"
                            placeholder="Select Buff"
                            value={
                              buffOptions.find((opt) => opt.value === editedItem.buff_id) || null
                            }
                            onChange={(selectedOption) =>
                              handleChange('buff_id', selectedOption?.value ?? null)
                            }
                            options={buffOptions}
                            isClearable={false}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
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
                            }}
                          />
                        ) : (
                          <input
                            id={col.field}
                            className="full-width"
                            type="text"
                            value={editedItem[col.field] || ''}
                            onChange={(e) => handleChange(col.field, e.target.value)}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {isBuffId ? (
                          <span>{value}</span>
                        ) : hasBuff ? (
                          <>
                            <span>
                              {value}
                              {col.unit && <span className="buff-suffix"> {col.unit}</span>}
                            </span>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Category Display Section */}
            <div className="category-info">
              <label className="field-label">Categories</label>
              {isEditing ? (
                <Select
                  isMulti
                  isClearable
                  placeholder="Select categories..."
                  value={
                    editedItem.categories?.map((cat) => ({
                      value: cat.category_id,
                      label: cat.name,
                    })) || []
                  }
                  onChange={(selected) => {
                    const categories =
                      selected?.map((s) => ({
                        category_id: s.value,
                        name: s.label,
                      })) || [];
                    setEditedItem((prev) => ({ ...prev, categories }));
                    setIsDirty(true);
                  }}
                  options={allCategories.map((cat) => ({
                    value: cat.category_id,
                    label: cat.name,
                  }))}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '38px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      boxShadow: 'none',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: '2px 8px',
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              ) : (
                <div className="category-badge-container">
                  {editedItem.categories?.length > 0 ? (
                    editedItem.categories.map((cat) => (
                      <span key={cat.category_id} className="category-badge">
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <span className="placeholder">No categories</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="editor-side">
            <div className="image-container" ref={imageRef}>
              {!imageError && editedItem.image_url ? (
                <img
                  src={editedItem.image_url}
                  alt={editedItem.name}
                  className="image-preview"
                  onError={() => setImageError(true)}
                  onClick={() => isEditing && setShowImagePopup(true)}
                />
              ) : (
                <div
                  className="image-placeholder"
                  onClick={() => isEditing && setShowImagePopup(true)}
                >
                  {isEditing ? <span>Click to add image URL</span> : 'No Image'}
                </div>
              )}
            </div>

            {valueFields.map((col) => {
              const value = editedItem[col.field];
              return (
                <div
                  key={col.field}
                  className={isEditing ? 'item-value' : 'inline-display item-value'}
                >
                  {isEditing ? (
                    <>
                      <label className="field-label" htmlFor={col.field}>
                        {col.label}
                      </label>
                      <input
                        id={col.field}
                        className="full-width"
                        type="text"
                        value={editedItem[col.field] || ''}
                        onChange={(e) => handleChange(col.field, e.target.value)}
                      />
                    </>
                  ) : (
                    <div className="inline-with-unit">
                      <span>{value || <span className="placeholder">{col.label}</span>}</span>
                      {value && col.unit && <span className="buff-suffix">{col.unit}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="editor-actions">
          {isEditing ? (
            <>
              <button className="save-button" onClick={handleSave} disabled={!isDirty || isSaving}>
                {isSaving ? (
                  <>
                    <span className="spinner" aria-label="Saving" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save
                  </>
                )}
              </button>
              <button className="cancel-button" onClick={handleCancel} disabled={isSaving}>
                <FaTimes /> Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this item?')) {
                    onDelete(item);
                  }
                }}
                disabled={isSaving}
              >
                🗑 Delete
              </button>
            </>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit
            </button>
          )}
        </div>
        {isEditing && showImagePopup && (
          <div className="image-url-popup">
            <label className="field-label" htmlFor="image_url">
              Image Url
            </label>
            <input
              className="image-url-input"
              type="text"
              id="image_url"
              value={editedItem.image_url || ''}
              placeholder="Paste image URL"
              onChange={(e) => handleChange('image_url', e.target.value)}
              onBlur={() => setShowImagePopup(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setShowImagePopup(false);
                }
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  setEditedItem((prev) => ({ ...prev, image_url: item.image_url }));
                  setShowImagePopup(false);
                }
              }}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemEditorCard;
