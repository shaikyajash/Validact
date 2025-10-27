import { useState, type FC } from "react";
import { validators } from "../utils";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import clsx from "clsx";
import useDebounce from "../hooks/useDebounce";
import { DropDownProps } from "../types";

const DropDown: FC<DropDownProps> = ({
  name,
  label,
  value,
  options,
  error,
  onChange,
  onBlur,
  styleProps = {},
}) => {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedSearch = useDebounce((searchKey: string) => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  });

  // Handle validation when dropdown closes
  const handleDropdownClose = () => {
    if (hasBeenOpened && onBlur) {
      onBlur?.(name, value, validators.required());
    }
  };

  const handleSearch = (searchKey: string) => {
    debouncedSearch(searchKey);
  };

  return (
    <div className={clsx("relative flex flex-col mb-4", styleProps.container)}>
      <label
        htmlFor={name}
        className={clsx(
          "absolute -top-2.5 left-2 px-1 text-sm",
          "transition-all duration-300 ease-in-out",
          "bg-white z-10",
          error ? "text-red-500" : "text-gray-600",
          styleProps.label
        )}
      >
        {label}
      </label>
      <div
        className={clsx(
          "relative border rounded-lg",
          "transition-all duration-200",
          "hover:border-blue-400 focus-within:border-blue-500",
          "shadow-sm hover:shadow-md",
          error ? "border-red-500" : "border-gray-300",
          styleProps.dropdownTrigger
        )}
        id={name}
        onClick={() => {
          if (showDropdown) {
            // Closing dropdown - validate
            handleDropdownClose();
          }
          setShowDropdown((prev) => !prev);
          setFilteredOptions(options);
          if (!hasBeenOpened) {
            setHasBeenOpened(true);
          }
        }}
      >
        <div className="flex items-center px-3 py-2 justify-between">
          <div className="flex items-center justify-center gap-2">
            <FaSearch className="text-gray-400 w-4 h-4 mr-2" />
            {value && !showDropdown ? (
              <p className="text-gray-800">{value}</p>
            ) : showDropdown ? (
              <input
                type="text"
                className={clsx(
                  "w-full bg-transparent",
                  "text-gray-800 placeholder-gray-400",
                  "outline-none focus:ring-0",
                  "transition-all duration-200",
                  styleProps.input
                )}
                placeholder="Enter to search..."
                autoFocus
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            ) : (
              <p className="text-gray-400">Search {label}</p>
            )}
          </div>
          <FaAngleDown
            className={clsx(
              "text-gray-400 w-4 h-4 ml-2",
              "transition-transform duration-200",
              showDropdown && "transform rotate-180"
            )}
          />
        </div>
      </div>

      {showDropdown && (
        <div
          className={clsx(
            "absolute w-full mt-1",
            "bg-white border rounded-lg",
            "shadow-lg z-20",
            "max-h-60 overflow-y-auto top-10",
            "animate-dropdown",
            styleProps.dropdownList
          )}
        >
          {filteredOptions.map((optionValue, key) => (
            <div
              key={key}
              className={clsx(
                "px-4 py-2 cursor-pointer",
                "transition-all duration-150",
                "hover:bg-blue-50",
                value === optionValue && "bg-blue-100 text-blue-700",
                styleProps.option
              )}
              onClick={() => {
                setShowDropdown(false);
                onChange?.(name, optionValue);
                // Validate after selection
                if (hasBeenOpened && onBlur) {
                  onBlur?.(name, optionValue, validators.required());
                }
              }}
            >
              {optionValue}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className={clsx("text-red-500 text-sm mt-1", styleProps.errorText)}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DropDown;
