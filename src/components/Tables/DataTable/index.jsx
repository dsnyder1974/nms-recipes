import { useState, useEffect } from 'react';
import DataRow from './DataRow';
import { FaSpinner } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './DataTable.css';

function DataTable({
  columns,
  fetchData,
  postItem,
  patchItem,
  deleteItem,
  getId,
  title,
  newItemTemplate,
}) {
  const [items, setItems] = useState([]);
  const [sortField, setSortField] = useState(columns[0]?.field || '');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);

  const [newItem, setNewItem] = useState(newItemTemplate);
  const [isAddingSaving, setIsAddingSaving] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchData();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(`Failed to fetch ${title.toLowerCase()}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [fetchData, title]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase() ?? '';
      bValue = bValue?.toLowerCase() ?? '';
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
  });

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => getId(item) !== id));
      toast.success(`${title} deleted!`);
    } catch (err) {
      console.error('Failed to delete item:', err);
      toast.error(`Failed to delete ${title.toLowerCase()}`);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      const savedItem = await patchItem(updatedItem);
      setItems((prev) => prev.map((item) => (getId(item) === getId(savedItem) ? savedItem : item)));
      toast.success(`${title} updated!`);
    } catch (err) {
      console.error('Failed to update item:', err);
      toast.error(`Failed to update ${title.toLowerCase()}`);
    }
  };

  const handleAddItem = async () => {
    const missingFields = columns
      .filter((col) => col.editable && col.required)
      .filter((col) => !newItem[col.field]?.trim?.());

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map((col) => col.label).join(', ')}`);
      return;
    }

    setIsAddingSaving(true);
    try {
      const added = await postItem(newItem);
      setItems((prev) => [...prev, added]);
      setNewItem(newItemTemplate);
      toast.success(`${title} added!`);
    } catch (err) {
      console.error('Failed to add item:', err);
      toast.error(`Failed to add ${title.toLowerCase()}`);
    } finally {
      setIsAddingSaving(false);
    }
  };

  const isAddFormValid = columns
    .filter((col) => col.editable && col.required)
    .every((col) => newItem[col.field]?.trim?.());

  return (
    <div className="category-table-container">
      <h2 className="category-title">{title}</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  tabIndex="0"
                  aria-sort={
                    sortField === col.field
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSort(col.field);
                  }}
                  className="sortable"
                  style={col.width ? { width: col.width } : {}}
                >
                  <div className="sortable-label-container">
                    <span className="sortable-label">{col.label}</span>
                    <span className="sort-arrow">
                      {sortField === col.field ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </div>
                </th>
              ))}
              <th className="actions-column"></th>
            </tr>
          </thead>

          <tbody>
            {sortedItems.map((item) => (
              <DataRow
                key={getId(item)}
                item={item}
                columns={columns}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                getId={getId}
              />
            ))}

            <tr className="add-category-row">
              {columns.map((col) => (
                <td
                  key={col.field}
                  className="editing-cell"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.editable ? (
                    <div className="cell-flex">
                      <input
                        type="text"
                        name={col.field}
                        value={newItem[col.field]}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            [col.field]: e.target.value,
                          })
                        }
                        className={`category-row-input ${
                          col.required && !newItem[col.field]?.trim?.() ? 'input-error' : ''
                        }`}
                        disabled={isAddingSaving}
                        placeholder={`Enter ${col.label}`}
                      />
                      {col.required ? (
                        <div className="required-hint">Required</div>
                      ) : (
                        <div className="required-hint" style={{ visibility: 'hidden' }}>
                          Required
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="cell-flex">
                      <div className="non-editable-cell">Auto</div>
                      <div className="required-hint" style={{ visibility: 'hidden' }}>
                        Required
                      </div>
                    </div>
                  )}
                </td>
              ))}
              <td>
                <button
                  onClick={handleAddItem}
                  disabled={isAddingSaving || !isAddFormValid}
                  title="Add"
                  className="icon-button add-button"
                >
                  {isAddingSaving ? <FaSpinner className="icon-spin" /> : <FiPlus />}
                </button>
                <div className="required-hint" style={{ visibility: 'hidden' }}>
                  Required
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;
