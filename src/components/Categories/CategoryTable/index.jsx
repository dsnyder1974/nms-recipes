import { useState, useEffect } from 'react';
import CategoryRow from '../CategoryRow';
import { fetchCategories, postCategory, deleteCategory } from '../../../api/categoryApi';
import './CategoryTable.css';

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [isAddingSaving, setIsAddingSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'name') {
      aValue = aValue?.toLowerCase() ?? '';
      bValue = bValue?.toLowerCase() ?? '';
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
  });

  return (
    <>
      <h2 className="category-title">Categories</h2>

      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('id')}
                tabIndex="0"
                aria-sort={
                  sortField === 'id'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSort('id');
                }}
                className="sortable id-column"
              >
                <div className="sortable-label-container">
                  <span className="sortable-label">ID</span>
                  <span className="sort-arrow">
                    {sortField === 'id' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                  </span>
                </div>
              </th>

              <th
                onClick={() => handleSort('name')}
                tabIndex="0"
                aria-sort={
                  sortField === 'name'
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSort('name');
                }}
                className="sortable"
              >
                <div className="sortable-label-container">
                  <span className="sortable-label">Name</span>
                  <span className="sort-arrow">
                    {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                  </span>
                </div>
              </th>

              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onUpdate={(updatedCategory) => {
                  setCategories((prev) =>
                    prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
                  );
                }}
                onDelete={handleDelete}
              />
            ))}
            {isAdding ? (
              <tr>
                <td>New</td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="image"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  />
                </td>
                <td>
                  <button
                    onClick={async () => {
                      setIsAddingSaving(true);
                      try {
                        const added = await postCategory(newCategory);
                        setCategories((prev) => [...prev, added]);
                        setIsAdding(false);
                        setNewCategory({ name: '', image: '' });
                      } catch (err) {
                        console.error('Failed to add category:', err);
                      } finally {
                        setIsAddingSaving(false);
                      }
                    }}
                    disabled={isAddingSaving}
                  >
                    {isAddingSaving ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewCategory({ name: '', image: '' });
                    }}
                    disabled={isAddingSaving}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4">
                  <button onClick={() => setIsAdding(true)}>+ Add Category</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

export default CategoryTable;
