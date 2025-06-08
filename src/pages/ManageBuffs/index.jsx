import DataTable from '../../components/Tables/DataTable';
import { fetchBuffs, postBuff, patchBuff, deleteBuff } from '../../api/buffApi';

const columns = [
  { field: 'buff_id', label: 'Buff ID', editable: false, width: '125px' },
  { field: 'name', label: 'Name', editable: true, required: true, width: '200px' },
  { field: 'description', label: 'Description', editable: true, required: false },
];

const ManageBuffs = () => {
  return (
    <DataTable
      title="Buffs"
      columns={columns}
      fetchData={fetchBuffs}
      postItem={postBuff}
      patchItem={patchBuff}
      deleteItem={deleteBuff}
      getId={(item) => item.buff_id}
      newItemTemplate={{ name: '', description: '' }}
    />
  );
};

export default ManageBuffs;
