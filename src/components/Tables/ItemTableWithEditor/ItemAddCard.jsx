import { useState, useRef, useEffect } from 'react';
import Select from 'react-select/creatable';
import './ItemEditorCard.css';

function ItemAddCard({ columns, buffs, onAdd, onCancel }) {
  const [newItem, setNewItem] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, []);

  const handleChange = (field, value) => {
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

  const buffOptions = [
    { value: null, label: 'No Buff' },
    ...buffs.map((b) => ({ value: b.buff_id, label: b.name })),
  ];

  const mainFields = columns.filter((c) => (c.group ?? 'main') === 'main' && c.field !== 'item_id');
  const buffFields = columns.filter((c) => c.group === 'buff');
  const valueFields = columns.filter((c) => c.group === 'value');

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal">
        <button className="close-button" onClick={onCancel}>
          &times;
        </button>

        <div className="editor-card-layout">
          <div className="editor-main">
            {mainFields.map((col) => (
              <div key={col.field} className="name-input">
                <input
                  ref={col.field === 'name' ? nameInputRef : null}
                  className="full-width"
                  type="text"
                  placeholder={col.label}
                  value={newItem[col.field] || ''}
                  onChange={(e) => handleChange(col.field, e.target.value)}
                />
              </div>
            ))}

            <div className="buff-info">
              {buffFields.map((col) => (
                <div key={col.field} className="buff-input">
                  {col.field === 'buff_id' ? (
                    <Select
                      className="buff-select"
                      classNamePrefix="buff"
                      placeholder="Select Buff"
                      value={buffOptions.find((opt) => opt.value === newItem.buff_id) || null}
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
                      className="full-width"
                      type="text"
                      placeholder={col.label}
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
            {valueFields.map((col) => (
              <div key={col.field} className="item-value">
                <input
                  className="full-width"
                  type="text"
                  placeholder={col.label}
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
      </div>
    </div>
  );
}

export default ItemAddCard;
