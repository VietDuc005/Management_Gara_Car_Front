import React, { useState, useEffect, useRef } from "react";
import useDebounce from "../../hooks/useDebounce";

const AutocompleteInput = ({
  placeholder,
  fetchSuggestions,
  searchParamKey,
  displayFormat,
  onSelect,
  initialDisplayValue = "",
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(initialDisplayValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 400);
  const wrapperRef = useRef(null);
  const [isItemSelected, setIsItemSelected] = useState(!!initialDisplayValue);

  useEffect(() => {
    setInputValue(initialDisplayValue);
    setIsItemSelected(!!initialDisplayValue);
  }, [initialDisplayValue]);

  useEffect(() => {
    if (
      !isItemSelected &&
      debouncedSearchTerm &&
      debouncedSearchTerm.length >= 2
    ) {
      const loadSuggestions = async () => {
        setLoading(true);
        try {
          const criteria = { [searchParamKey]: debouncedSearchTerm };
          // Vì API tìm thợ của bạn có thể tìm theo SĐT, ta cũng thêm key đó vào
          if (
            searchParamKey === "tenTho" &&
            /^\d+$/.test(debouncedSearchTerm)
          ) {
            criteria["soDienThoai"] = debouncedSearchTerm;
          }

          const response = await fetchSuggestions(criteria, 0, 10);
          const results = response?.data?.content || response?.content || [];
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Lỗi tải gợi ý:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      };
      loadSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, fetchSuggestions, searchParamKey, isItemSelected]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsItemSelected(false);
    if (e.target.value === "") {
      onSelect(null);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(displayFormat(suggestion));
    setSuggestions([]);
    setShowSuggestions(false);
    setIsItemSelected(true);
    onSelect(suggestion);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (!isItemSelected && suggestions.length > 0)
            setShowSuggestions(true);
        }}
        className="w-full input-style text-sm"
        required={required}
        autoComplete="off"
      />
      {showSuggestions && (
        <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <li className="px-3 py-2 text-sm text-gray-500 italic">
              Đang tìm...
            </li>
          )}
          {!loading && suggestions.length === 0 && inputValue.length >= 2 && (
            <li className="px-3 py-2 text-sm text-gray-500 italic">
              Không tìm thấy.
            </li>
          )}
          {!loading &&
            suggestions.map((suggestion) => (
              <li
                key={suggestion.maTho || suggestion.maXe}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-800 dark:text-gray-100"
              >
                {displayFormat(suggestion)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
