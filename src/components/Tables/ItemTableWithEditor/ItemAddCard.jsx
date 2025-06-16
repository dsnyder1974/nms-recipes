import { useState, useEffect, useRef } from 'react';
import Select from 'react-select/creatable';
import './ItemEditorCard.css';

function ItemAddCard({ columns, buffs, onAdd, onCancel }) {
  const [newItem, setNewItem] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const modalRef = useRef(null);
  const imageRef = useRef(null);
  const nameInputRef = useRef(null);

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

  const handleChange = (field, value) => {
    if (field === 'image_url') setImageError(false);
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onAdd(newItem);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal" ref={modalRef}>
        <button className="close-button" onClick={onCancel}>
          &times;
        </button>

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
              </div>
            ))}

            <div className="buff-info">
              {buffFields.map((col) => (
                <div key={col.field} className="buff-input">
                  <label className="field-label" htmlFor={col.field}>
                    {col.label}
                  </label>
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

        <div className="editor-actions">
          <button className="save-button" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Add'}
          </button>
          <button className="cancel-button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </div>

        {showImagePopup && (
          <div className="image-url-popup">
            <label className="field-label" htmlFor="image_url">
              Image Url
            </label>
            <input
              className="image-url-input"
              type="text"
              id="image_url"
              value={newItem.image_url || ''}
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
                  setNewItem((prev) => ({ ...prev, image_url: '' }));
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

export default ItemAddCard;
