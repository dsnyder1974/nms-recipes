import { useState, useEffect } from 'react';
import CategoryRow from '../CategoryRow';
import {
  fetchCategories,
  patchCategory,
  deleteCategory,
  postCategory,
} from '../../../api/categoryApi';
import { FaSpinner } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './CategoryTable.css';

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState('category_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);

  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isAddingSaving, setIsAddingSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
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

  const handleDeleteCategory = async (category_id) => {
    try {
      await deleteCategory(category_id);
      setCategories((prev) => prev.filter((cat) => cat.category_id !== category_id));
      toast.success('Category deleted!');
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error('Failed to delete category');
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const savedCategory = await patchCategory(updatedCategory);
      setCategories((prev) =>
        prev.map((cat) => (cat.category_id === savedCategory.category_id ? savedCategory : cat))
      );
      toast.success('Category updated!');
    } catch (err) {
      console.error('Failed to update category:', err);
      toast.error('Failed to update category');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsAddingSaving(true);
    try {
      const added = await postCategory(newCategory);
      setCategories((prev) => [...prev, added]);
      setNewCategory({ name: '', description: '' });
      toast.success('Category added!');
    } catch (err) {
      console.error('Failed to add category:', err);
      toast.error('Failed to add category');
    } finally {
      setIsAddingSaving(false);
    }
  };

  return (
    <>
      <div className="category-table-container">
        <h2 className="category-title">Categories</h2>
        {isLoading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <table className="category-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('category_id')}
                  tabIndex="0"
                  aria-sort={
                    sortField === 'category_id'
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSort('category_id');
                  }}
                  className="sortable id-column"
                >
                  <div className="sortable-label-container">
                    <span className="sortable-label">Cateogry ID</span>
                    <span className="sort-arrow">
                      {sortField === 'category_id' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
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

                <th>Description</th>
                <th className="actions-column"></th>
              </tr>
            </thead>

            <tbody>
              {sortedCategories.map((category) => (
                <CategoryRow
                  key={category.category_id}
                  category={category}
                  onUpdate={handleUpdateCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}

              {/* Always-visible Add Category Row */}
              <tr className="add-category-row">
                <td>New</td>
                <td className="editing-cell">
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        name: e.target.value,
                      })
                    }
                    className="category-row-input"
                    disabled={isAddingSaving}
                    placeholder="Enter name"
                  />
                </td>
                <td className="editing-cell">
                  <input
                    type="text"
                    name="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    className="category-row-input"
                    disabled={isAddingSaving}
                    placeholder="Enter description (optional)"
                  />
                </td>
                <td>
                  <button
                    onClick={handleAddCategory}
                    disabled={isAddingSaving}
                    title="Add Category"
                    className="icon-button add-button"
                  >
                    {isAddingSaving ? <FaSpinner className="icon-spin" /> : <FiPlus />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default CategoryTable;
