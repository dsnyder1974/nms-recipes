import DataTable from '../../components/Tables/DataTable';
import { fetchItems, postItem, patchItem, deleteItem } from '../../api/itemApi';

const columns = [
  { field: 'item_id', label: 'Item ID', editable: false, width: '125px' },
  { field: 'name', label: 'Name', editable: true, required: true, width: '200px' },
  { field: 'description', label: 'Description', editable: true, required: false },
  { field: 'value', label: 'Value', editable: true, required: true },
];

const ManageItems = () => {
  return (
    <DataTable
      title="Items"
      columns={columns}
      fetchData={fetchItems}
      postItem={postItem}
      patchItem={patchItem}
      deleteItem={deleteItem}
      getId={(item) => item.item_id}
      newItemTemplate={{ name: '', description: '' }}
    />
  );
};

export default ManageItems;
