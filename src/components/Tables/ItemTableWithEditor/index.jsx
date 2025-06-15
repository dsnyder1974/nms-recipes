import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import ItemEditorCard from './ItemEditorCard';
import { fetchBuffs } from '../../../api/buffApi';
import './DataTable.css';

function ItemTableWithEditor({
  columns, // columns to display in the table
  editorColumns, // full editable field set (with groups)
  fetchData,
  patchItem,
  getId,
  title,
}) {
  const [items, setItems] = useState([]);
  const [sortField, setSortField] = useState(columns[0]?.field || '');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [buffs, setBuffs] = useState([]);

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

  useEffect(() => {
    const loadBuffs = async () => {
      try {
        const data = await fetchBuffs();
        setBuffs(data);
      } catch (error) {
        console.error('Error fetching buffs:', error);
        toast.error('Failed to fetch buffs');
      }
    };

    loadBuffs();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase() ?? '';
        bValue = bValue?.toLowerCase() ?? '';
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });
  }, [items, sortField, sortDirection]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [sortedItems, filterText]);

  const handleSave = async (updatedItem) => {
    try {
      const saved = await patchItem(updatedItem);
      setItems((prev) => prev.map((item) => (getId(item) === getId(saved) ? saved : item)));
      toast.success(`${title} updated!`);
      // setEditingItem(null);
    } catch (err) {
      console.error('Failed to update item:', err);
      toast.error(`Failed to update ${title.toLowerCase()}`);
    }
  };

  const handleRowClick = (item) => {
    setEditingItem(item);
  };

  return (
    <div className="category-table-container">
      <h2 className="category-title">{title}</h2>

      <div className="datatable-header">
        <input
          type="text"
          placeholder="Filter items..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="filter-input"
        />
      </div>

      {isLoading ? (
        <p>
          <FaSpinner className="icon-spin" /> Loading...
        </p>
      ) : filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <>
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
              {filteredItems.map((item) => (
                <tr
                  key={getId(item)}
                  className="clickable-row"
                  onClick={() => handleRowClick(item)}
                >
                  {columns.map((col) => (
                    <td key={col.field}>{item[col.field]}</td>
                  ))}
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Modal rendered outside the table */}
          {editingItem && (
            <ItemEditorCard
              item={editingItem}
              columns={editorColumns}
              buffs={buffs}
              onSave={handleSave}
              onCancel={() => setEditingItem(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ItemTableWithEditor;
