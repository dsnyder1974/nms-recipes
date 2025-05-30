import { useState, useEffect } from "react";
import CategoryRow from "../CategoryRow";
import { fetchCategories } from "../../../api/categoryApi";
import "./CategoryTable.css";

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "name") {
      aValue = aValue?.toLowerCase() ?? "";
      bValue = bValue?.toLowerCase() ?? "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });

  return (
    <>
      <h2 className="category-title">Categories</h2>
      <table className="category-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("id")}
              tabIndex="0"
              aria-sort={
                sortField === "id"
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSort("id");
              }}
              className="sortable"
            >
              <div className="sortable-label-container">
                <span className="sortable-label">ID</span>
                <span className="sort-arrow">
                  {sortField === "id"
                    ? sortDirection === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </span>
              </div>
            </th>

            <th
              onClick={() => handleSort("name")}
              tabIndex="0"
              aria-sort={
                sortField === "name"
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSort("name");
              }}
              className="sortable"
            >
              <div className="sortable-label-container">
                <span className="sortable-label">Name</span>
                <span className="sort-arrow">
                  {sortField === "name"
                    ? sortDirection === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </span>
              </div>
            </th>

            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CategoryTable;
