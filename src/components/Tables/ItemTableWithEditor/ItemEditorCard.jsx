import { useEffect, useRef, useState } from 'react';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import Select from 'react-select/creatable';
import './ItemEditorCard.css';

function ItemEditorCard({ item, columns, buffs, onSave, onCancel }) {
  const [editedItem, setEditedItem] = useState(item);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    setEditedItem(item);
    setIsEditing(false);
    setIsDirty(false);
    setIsSaving(false);
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
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditing, isDirty, item]);

  const handleChange = (field, value) => {
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
                  col.field === 'description' ? (
                    <textarea
                      className="full-width"
                      value={editedItem[col.field] || ''}
                      onChange={(e) => handleChange(col.field, e.target.value)}
                    />
                  ) : (
                    <input
                      ref={col.field === 'name' ? nameInputRef : null}
                      className="full-width"
                      type="text"
                      value={editedItem[col.field] || ''}
                      onChange={(e) => handleChange(col.field, e.target.value)}
                    />
                  )
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
              {buffFields.map((col, idx) => {
                const value =
                  col.field === 'buff_id'
                    ? buffOptions.find((opt) => opt.value === editedItem.buff_id)?.label ||
                      'No Buff'
                    : editedItem[col.field] || '';

                return (
                  <div key={col.field} className={isEditing ? 'buff-input' : 'inline-display'}>
                    {isEditing ? (
                      col.field === 'buff_id' ? (
                        <Select
                          className="buff-select"
                          classNamePrefix="buff"
                          placeholder="Select Buff"
                          value={
                            buffOptions.find((opt) => opt.value === editedItem.buff_id) || null
                          }
                          onChange={(selectedOption) => {
                            handleChange('buff_id', selectedOption?.value ?? null);
                          }}
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
                          className="full-width"
                          type="text"
                          value={editedItem[col.field] || ''}
                          onChange={(e) => handleChange(col.field, e.target.value)}
                        />
                      )
                    ) : (
                      <>
                        <span>{value || <span className="placeholder">{col.label}</span>}</span>
                        {idx === buffFields.length - 1 && (
                          <span className="buff-suffix"> minutes</span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="editor-side">
            {editedItem.image_url ? (
              <img src={editedItem.image_url} alt={editedItem.name} className="image-preview" />
            ) : (
              <div className="image-placeholder" />
            )}

            {valueFields.map((col) => (
              <div
                key={col.field}
                className={isEditing ? 'item-value' : 'inline-display item-value'}
              >
                {isEditing ? (
                  <input
                    className="full-width"
                    type="text"
                    value={editedItem[col.field] || ''}
                    onChange={(e) => handleChange(col.field, e.target.value)}
                  />
                ) : (
                  <span>
                    {editedItem[col.field] || <span className="placeholder">{col.label}</span>}
                  </span>
                )}
              </div>
            ))}
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
            </>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemEditorCard;
