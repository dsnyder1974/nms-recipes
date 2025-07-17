// components/Inputs/ImageGridSelector.jsx
import { useEffect, useState } from 'react';

export function useImageOptions(apiUrl) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const opts = data.map((img) => ({
          label: img.key.split('/').pop(),
          value: img.url,
        }));
        setOptions(opts);
      });
  }, [apiUrl]);

  return options;
}

export default function ImageGridSelector({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options.map((opt) => (
        <div
          key={opt.value}
          style={{
            border: value === opt.value ? '3px solid #007acc' : '1px solid #ccc',
            borderRadius: 4,
            padding: 4,
            cursor: 'pointer',
          }}
          onClick={() => onChange(opt.value)}
        >
          <img
            src={opt.value}
            alt={opt.label}
            style={{ width: 80, height: 80, objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}
