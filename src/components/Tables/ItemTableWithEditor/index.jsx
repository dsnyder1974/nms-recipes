import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import ItemEditorCard from './ItemEditorCard';
import ItemAddCard from './ItemAddCard';
import { getItemWithCategories } from '../../../api/itemApi';
import { fetchBuffs } from '../../../api/buffApi';
import { fetchCategories } from '../../../api/categoryApi';
import { fetchItemsCategories, patchCategoriesByItem } from '../../../api/itemCategoryApi';

import { useTopItemsByBuff } from '../../Hooks/useTopItemsByBuff';

import Select from 'react-select/creatable';

import './ItemTableWithEditor.css';

function ItemTableWithEditor({
  columns, // columns to display in the table
  editorColumns, // full editable field set (with groups)
  fetchData,
  patchItem,
  postItem,
  deleteItem,
  getId,
  title,
  disableSorting = false,
}) {
  const [items, setItems] = useState([]);
  const [itemNamesById, setItemNamesById] = useState({});
  const [sortField, setSortField] = useState(columns[0]?.field || '');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [buffs, setBuffs] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [itemStack, setItemStack] = useState([]);
  const [showTopPerBuff, setShowTopPerBuff] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const [items, allItemCategories] = await Promise.all([
          fetchData(),
          fetchItemsCategories(), // fetch ALL category associations
        ]);

        // group categories by item_id
        const categoriesByItem = allItemCategories.reduce((acc, row) => {
          const { item_id, category_id, name } = row;
          if (!acc[item_id]) acc[item_id] = [];
          acc[item_id].push({ category_id, name });
          return acc;
        }, {});

        // merge into items
        const enrichedItems = items.map((item) => ({
          ...item,
          categories: categoriesByItem[item.item_id] || [],
        }));

        setItems(enrichedItems);
        setItemNamesById(
          Object.fromEntries(enrichedItems.map((item) => [item.item_id, item.name]))
        );
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
    const loadBuffsAndCategories = async () => {
      try {
        const [buffsData, categoriesData] = await Promise.all([fetchBuffs(), fetchCategories()]);
        setBuffs(buffsData);
        setAllCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching buffs or categories:', error);
        toast.error('Failed to fetch buffs or categories');
      }
    };

    loadBuffsAndCategories();
  }, []);

  const getBuffName = (id) => buffs.find((b) => b.buff_id === id)?.name ?? '- No buff -';

  const getSortableValue = (item, field) => {
    if (field === 'buff_id') {
      return getBuffName(item.buff_id).toLowerCase();
    }
    const value = item[field];
    return typeof value === 'string' ? value.toLowerCase() : value;
  };

  const topItemsByBuff = useTopItemsByBuff(items, {
    topN: 3,
    sortField: 'units', // or another metric
  });

  const topItemsFlat = useMemo(() => {
    const flatItems = Object.values(topItemsByBuff)
      .flat()
      .filter((item) => item); // avoid undefined

    return [...flatItems].sort((a, b) => {
      let aValue = getSortableValue(a, sortField);
      let bValue = getSortableValue(b, sortField);

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase() ?? '';
        bValue = bValue?.toLowerCase() ?? '';
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });
  }, [topItemsByBuff, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = useMemo(() => {
    if (disableSorting) return items;

    return [...items].sort((a, b) => {
      let aValue = getSortableValue(a, sortField);
      let bValue = getSortableValue(b, sortField);

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

  const baseItems = showTopPerBuff ? topItemsFlat : sortedItems;

  const filteredItems = useMemo(() => {
    return baseItems.filter((item) => {
      const matchesText = Object.entries(item).some(([key, val]) => {
        if (key === 'buff_id') {
          const buffName = buffs.find((b) => b.buff_id === val)?.name ?? '';
          return buffName.toLowerCase().includes(filterText.toLowerCase());
        }
        return val?.toString().toLowerCase().includes(filterText.toLowerCase());
      });

      const matchesCategory =
        !selectedCategoryId ||
        (item.categories || []).some((cat) => cat.category_id === selectedCategoryId);

      return matchesText && matchesCategory;
    });
  }, [baseItems, filterText, selectedCategoryId, buffs]);

  const handleSave = async (updatedItem) => {
    try {
      console.log('Saving item:', updatedItem);
      const saved = await patchItem(updatedItem);
      if (Array.isArray(updatedItem.categories)) {
        await patchCategoriesByItem(updatedItem);
      }
      const refreshItem = await getItemWithCategories(saved.item_id);
      // console.log('Refreshed item:', refreshItem);

      setItems((prev) =>
        prev.map((item) => (getId(item) === getId(refreshItem) ? refreshItem : item))
      );
      toast.success(`${title} updated!`);
    } catch (err) {
      console.error('Failed to update item:', err);
      toast.error(`Failed to update ${title.toLowerCase()}`);
    }
  };

  const handleAdd = async (newItem) => {
    try {
      const added = await postItem(newItem);
      if (Array.isArray(newItem.categories) && newItem.categories.length > 0) {
        await patchCategoriesByItem({
          item_id: added.item_id,
          categories: newItem.categories,
        });
      }
      const addedItem = await getItemWithCategories(added.item_id);
      setItems((prev) => [...prev, addedItem]);
      setItemNamesById((prev) => ({
        ...prev,
        [addedItem.item_id]: addedItem.name,
      }));

      toast.success(`${title} added!`);
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add item:', err);
      toast.error(`Failed to add ${title.toLowerCase()}`);
    }
  };

  const handleDelete = async (itemToDelete) => {
    try {
      await deleteItem(itemToDelete.item_id);
      setItems((prev) => prev.filter((i) => getId(i) !== getId(itemToDelete)));
      toast.success(`${title} deleted.`);
      setEditingItem(null);
      setItemStack([]); // clear history
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(`Failed to delete ${title.toLowerCase()}`);
    }
  };

  const handleOpenItem = (newItemId) => {
    const newItem = items.find((i) => i.item_id === newItemId);
    if (newItem) {
      setItemStack((prev) => (editingItem ? [...prev, editingItem] : prev));
      setEditingItem(newItem);
    } else {
      console.warn(`Item with id ${newItemId} not found`);
    }
  };

  const handleBack = () => {
    const previous = itemStack.at(-1);
    if (previous) {
      setItemStack((prev) => prev.slice(0, -1));
      setEditingItem(previous);
    }
  };

  const handleRowClick = (item) => {
    setEditingItem(item);
  };

  const handlePreferredRecipeChange = (itemId, recipeId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === itemId ? { ...item, preferred_recipe_id: recipeId } : item
      )
    );
  };

  return (
    <div className="category-table-container">
      <h2 className="category-title">{title}</h2>

      <div className="datatable-header">
        <div className="filter-input-wrapper">
          <input
            type="text"
            placeholder="Filter items..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
          {filterText && (
            <button
              className="clear-filter-button"
              onClick={() => setFilterText('')}
              aria-label="Clear filter"
            >
              ×
            </button>
          )}
        </div>

        <div style={{ marginLeft: '12px', minWidth: '240px' }}>
          <Select
            isClearable
            placeholder="Filter by category"
            value={
              selectedCategoryId
                ? {
                    value: selectedCategoryId,
                    label: allCategories.find((c) => c.category_id === selectedCategoryId)?.name,
                  }
                : null
            }
            onChange={(selected) => {
              setSelectedCategoryId(selected ? selected.value : null);
            }}
            options={[
              { value: null, label: 'All Categories' },
              ...allCategories.map((cat) => ({
                value: cat.category_id,
                label: cat.name,
              })),
            ]}
            styles={{
              container: (base) => ({ ...base, fontSize: '0.9rem' }),
              control: (base, state) => ({
                ...base,
                minHeight: '36px',
                height: '36px',
                borderColor: state.isFocused ? '#2684FF' : base.borderColor,
                boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : base.boxShadow,
              }),
              valueContainer: (base) => ({
                ...base,
                height: '36px',
                padding: '0 8px',
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: '36px',
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: '4px',
              }),
              clearIndicator: (base) => ({
                ...base,
                padding: '4px',
              }),
            }}
          />
        </div>

        <label style={{ marginLeft: '12px', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={showTopPerBuff}
            onChange={(e) => setShowTopPerBuff(e.target.checked)}
            style={{ marginRight: '6px' }}
          />
          Show Top 3 Items Per Buff
        </label>
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
                    onClick={disableSorting ? undefined : () => handleSort(col.field)}
                    tabIndex={disableSorting ? -1 : 0}
                    aria-sort={
                      disableSorting
                        ? 'none'
                        : sortField === col.field
                          ? sortDirection === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                    }
                    onKeyDown={
                      disableSorting
                        ? undefined
                        : (e) => {
                            if (e.key === 'Enter' || e.key === ' ') handleSort(col.field);
                          }
                    }
                    className="sortable"
                    style={{
                      ...(col.width ? { width: col.width } : {}),
                      ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                    }}
                  >
                    <div className="sortable-label-container">
                      <span className="sortable-label">{col.label}</span>
                      <span className="sort-arrow">
                        {disableSorting
                          ? ''
                          : sortField === col.field
                            ? sortDirection === 'asc'
                              ? '▲'
                              : '▼'
                            : ''}
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
                    <td key={col.field}>
                      {col.field === 'buff_id' ? (
                        getBuffName(item[col.field])
                      ) : col.field === 'name' ? (
                        <>
                          <div>
                            {typeof item[col.field] === 'object'
                              ? '[Invalid name]'
                              : item[col.field]}
                          </div>
                          {Array.isArray(item.categories) && item.categories.length > 0 && (
                            <div className="category-badge-container">
                              {item.categories.map((cat) => (
                                <span key={cat.category_id} className="category-badge">
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      ) : typeof item[col.field] === 'object' ? (
                        JSON.stringify(item[col.field])
                      ) : (
                        item[col.field]
                      )}
                    </td>
                  ))}
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-row-button" onClick={() => setIsAdding(true)}>
            + Add Row
          </button>

          {/* Modal rendered outside the table */}
          {editingItem && (
            <ItemEditorCard
              item={editingItem}
              itemNamesById={itemNamesById}
              columns={editorColumns}
              buffs={buffs}
              allCategories={allCategories}
              onSave={handleSave}
              onCancel={() => {
                setEditingItem(null);
                setItemStack([]); // clear history
              }}
              onDelete={handleDelete}
              onOpenItem={handleOpenItem}
              onBack={itemStack.length > 0 ? handleBack : null}
              onPreferredRecipeChange={handlePreferredRecipeChange}
            />
          )}
          {isAdding && (
            <ItemAddCard
              columns={editorColumns}
              buffs={buffs}
              allCategories={allCategories}
              onAdd={handleAdd}
              onCancel={() => setIsAdding(false)}
              existingNames={Object.values(itemNamesById)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ItemTableWithEditor;
