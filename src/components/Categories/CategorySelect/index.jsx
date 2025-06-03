// src/components/TagSelect.js

//import React from 'react';
import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import CustomOption from './CustomOption';
import { fetchCategories } from '../../../api/categoryApi';

export default function CategorySelect() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const fetched = await fetchCategories();
        const mappedOptions = fetched.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setOptions(mappedOptions);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setSelectedOption(newOption);
  };

  const handleDeleteOption = (optionToDelete) => {
    setOptions((prev) => prev.filter((opt) => opt.value !== optionToDelete.value));
    if (selectedOption?.value === optionToDelete.value) {
      setSelectedOption(null);
    }
  };

  return (
    <CreatableSelect
      isClearable
      isLoading={isLoading}
      isDisabled={isLoading}
      loadingMessage={() => 'Loading options...'}
      options={options}
      value={selectedOption}
      onChange={setSelectedOption}
      onCreateOption={handleCreate}
      components={{ Option: CustomOption }}
      onDeleteOption={handleDeleteOption}
      placeholder={isLoading ? 'Loading...' : ''}
    />
  );
}
