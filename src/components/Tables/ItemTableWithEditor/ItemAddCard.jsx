import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import ImageGridSelector, { useImageOptions } from './ImageGridSelector';

import './ItemEditorCard.css';

function ItemAddCard({ columns, buffs, allCategories, onAdd, onCancel, existingNames = [] }) {
  const [newItem, setNewItem] = useState({ categories: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const modalRef = useRef(null);
  const imageRef = useRef(null);
  const nameInputRef = useRef(null);
  const [nameError, setNameError] = useState('');

  const mainFields = columns.filter((c) => (c.group ?? 'main') === 'main' && c.field !== 'item_id');
  const buffFields = columns.filter((c) => c.group === 'buff');
  const valueFields = columns.filter((c) => c.group === 'value');
  const buffOptions = [
    { value: null, label: 'No Buff' },
    ...buffs.map((b) => ({ value: b.buff_id, label: b.name })),
  ];

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showImagePopup) return;
        onCancel();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.closest('.modal-overlay, .dialog')) {
        return;
      }
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel, showImagePopup]);

  const imageOptions = useImageOptions(
    'https://h7p3wmkasd.execute-api.us-east-2.amazonaws.com/item-images'
  );

  const handleChange = (field, value) => {
    if (field === 'image_url') setImageError(false);

    if (field === 'name') {
      const trimmed = value.trim().toLowerCase();
      const isDuplicate = existingNames.some((n) => n.toLowerCase() === trimmed);
      setNameError(isDuplicate ? 'An item with this name already exists.' : '');
    }

    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const validateItem = () => {
    const missingFields = columns
      .filter((col) => col.required)
      .filter((col) => {
        const value = newItem[col.field];
        return (
          value === undefined ||
          value === '' ||
          value === null ||
          (Array.isArray(value) && value.length === 0)
        );
      });

    return missingFields.map((col) => col.label);
  };

  const handleSubmit = async () => {
    const missing = validateItem();
    console.log('Missing fields:', missing);
    if (missing.length > 0) {
      alert(`Please fill out: ${missing.join(', ')}`);
      return;
    }

    setIsSaving(true);
    try {
      await onAdd(newItem);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal editing" ref={modalRef}>
        <button className="close-button" onClick={onCancel}>
          &times;
        </button>
        <h2 className="editor-title">Add Item</h2>
        <div className="editor-card-layout">
          <div className="editor-main">
            {mainFields.map((col) => (
              <div
                key={col.field}
                className={col.field === 'description' ? 'description-input' : 'name-input'}
              >
                <label className="field-label" htmlFor={col.field}>
                  {col.label}
                </label>

                {col.field === 'description' ? (
                  <textarea
                    id={col.field}
                    className="full-width"
                    value={newItem[col.field] || ''}
                    onChange={(e) => handleChange(col.field, e.target.value)}
                  />
                ) : (
                  <input
                    id={col.field}
                    ref={col.field === 'name' ? nameInputRef : null}
                    className="full-width"
                    type="text"
                    value={newItem[col.field] || ''}
                    onChange={(e) => handleChange(col.field, e.target.value)}
                  />
                )}
                {col.required && <span className="required-hint">Required</span>}
                {col.field === 'name' && nameError && (
                  <div className="validation-error" style={{ color: 'red', fontSize: '0.9em' }}>
                    {nameError}
                  </div>
                )}
              </div>
            ))}

            <div className="categories-select">
              <label className="field-label">Categories</label>
              {columns.find((c) => c.field === 'categories' && c.required) && (
                <span className="required-hint">Required</span>
              )}
              <Select
                isMulti
                isClearable
                placeholder="Select categories..."
                value={
                  newItem.categories?.map((cat) => ({
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
                  setNewItem((prev) => ({ ...prev, categories }));
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
            </div>
          </div>

          <div className="editor-side">
            <div className="image-container" ref={imageRef}>
              {!imageError && newItem.image_url ? (
                <img
                  src={newItem.image_url}
                  alt="Preview"
                  className="image-preview"
                  onError={() => setImageError(true)}
                  onClick={() => setShowImagePopup(true)}
                />
              ) : (
                <div className="image-placeholder" onClick={() => setShowImagePopup(true)}>
                  <span>Click to add image URL</span>
                </div>
              )}
            </div>

            {valueFields.map((col) => (
              <div key={col.field} className="item-value">
                <label className="field-label" htmlFor={col.field}>
                  {col.label}
                </label>
                {col.required && <span className="required-hint">Required</span>}
                <input
                  id={col.field}
                  className="full-width"
                  type="text"
                  value={newItem[col.field] || ''}
                  onChange={(e) => handleChange(col.field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="buff-info">
          {buffFields.map((col) => (
            <div key={col.field} className="buff-input">
              <label className="field-label" htmlFor={col.field}>
                {col.label}
              </label>
              {col.required && <span className="required-hint">Required</span>}
              {col.field === 'buff_id' ? (
                <Select
                  inputId={col.field}
                  className="buff-select"
                  classNamePrefix="buff"
                  placeholder="Select Buff"
                  value={buffOptions.find((opt) => opt.value === newItem.buff_id) || null}
                  onChange={(option) => handleChange('buff_id', option?.value ?? null)}
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
                  value={newItem[col.field] || ''}
                  onChange={(e) => handleChange(col.field, e.target.value)}
                />
              )}
              {col.field === 'buff_duration' && <span className="buff-suffix"> minutes</span>}
            </div>
          ))}
        </div>

        <div className="editor-actions">
          <button className="save-button" onClick={handleSubmit} disabled={isSaving || !!nameError}>
            {isSaving ? 'Saving...' : 'Add'}
          </button>
          <button className="cancel-button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </div>

        {showImagePopup && (
          <div className="image-url-popup">
            <label className="field-label">Select Image</label>
            <ImageGridSelector
              value={newItem.image_url}
              onChange={(val) => {
                handleChange('image_url', val);
                setShowImagePopup(false); // Close popup on selection
              }}
              options={imageOptions}
            />
            <button
              onClick={() => setShowImagePopup(false)}
              className="cancel-button"
              style={{ marginTop: '10px' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemAddCard;
