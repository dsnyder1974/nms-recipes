// src/components/CustomOption.js
import { GoTrash } from "react-icons/go";

export default function CustomOption(props) {
    const { data, innerRef, innerProps } = props;

    const handleDelete = (e) => {
        e.stopPropagation();
        props.selectProps.onDeleteOption(data);
    };

    return (
        <div
            ref={innerRef}
            {...innerProps}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                alignItems: 'center',
            }}
        >
            <span>{data.label}</span>
            <button
                onClick={handleDelete}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'silver',
                    cursor: 'pointer',
                    padding: 0,
                }}
                title="Delete"
                aria-label="Delete option"
            >
                <GoTrash size={16} />
            </button>
        </div>
    );
}
