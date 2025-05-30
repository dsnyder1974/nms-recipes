import "./CategoryRow.css"; // Add this import for row styles

function CategoryRow({ category }) {
  return (
    <tr className="category-row">
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>
        {category.image ? (
          <img src={category.image} alt={category.name} className="category-image" />
        ) : (
          <span className="no-image">No image</span>
        )}
      </td>
    </tr>
  );
}

export default CategoryRow;
