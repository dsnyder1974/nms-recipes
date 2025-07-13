// import DataTable from '../../components/Tables/DataTable';
import ItemTableWithEditor from '../../components/Tables/ItemTableWithEditor';

import { getTopItemsByBuff, postItem, patchItem, deleteItem } from '../../api/itemApi';

const columns = [
  { field: 'item_id', label: 'Item ID', editable: false, width: '80px' },
  { field: 'name', label: 'Name', editable: true, required: true, width: '200px' },
  { field: 'buff_id', label: 'Buff', editable: true, group: 'buff', minWidth: '125px' },
  { field: 'buff_bonus_text', label: 'Bonus', editable: true, group: 'buff', minWidth: '125px' },
  {
    field: 'buff_duration_minutes',
    label: 'Duration (min)',
    editable: true,
    group: 'buff',
    minWidth: '125px',
  },
];

const editorColumns = [
  { field: 'name', label: 'Name', editable: true, required: true, group: 'main' },
  { field: 'item_id', label: 'Item ID', editable: false, group: 'main' },
  { field: 'description', label: 'Description', editable: true, group: 'main' },
  { field: 'buff_id', label: 'Buff Name', editable: true, group: 'buff' },
  { field: 'buff_bonus_text', label: 'Buff Bonus', editable: true, group: 'buff' },
  {
    field: 'buff_duration_minutes',
    label: 'Buff Duration (min)',
    editable: true,
    group: 'buff',
    unit: 'minutes',
  },
  { field: 'value', label: 'Value', editable: true, group: 'value', unit: 'units' },
];

const TopItemsByBuff = () => {
  return (
    <ItemTableWithEditor
      title="Items"
      columns={columns}
      editorColumns={editorColumns}
      fetchData={getTopItemsByBuff}
      postItem={postItem}
      patchItem={patchItem}
      deleteItem={deleteItem}
      getId={(item) => item.item_id}
      newItemTemplate={{ name: '', description: '' }}
      disableSorting={true}
    />
  );
};

export default TopItemsByBuff;
