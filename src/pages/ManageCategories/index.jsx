import DataTable from '../../components/Tables/DataTable';
import {
  fetchCategories,
  postCategory,
  patchCategory,
  deleteCategory,
} from '../../api/categoryApi';

const columns = [
  { field: 'category_id', label: 'Category ID', editable: false, width: '125px' },
  { field: 'name', label: 'Name', editable: true, required: true, width: '200px' },
  { field: 'description', label: 'Description', editable: true, required: false },
];

const ManageCategories = () => {
  return (
    <DataTable
      title="Categories"
      columns={columns}
      fetchData={fetchCategories}
      postItem={postCategory}
      patchItem={patchCategory}
      deleteItem={deleteCategory}
      getId={(item) => item.category_id}
      newItemTemplate={{ name: '', description: '' }}
    />
  );
};

export default ManageCategories;
