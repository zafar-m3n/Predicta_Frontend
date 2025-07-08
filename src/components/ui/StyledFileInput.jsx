import React, { useRef } from "react";
import Icon from "@/components/ui/Icon";

const StyledFileInput = ({ label, file, onChange, onRemove, preferredSize = "" }) => {
  const fileInputRef = useRef();

  const handleRemove = () => {
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {preferredSize && <span className="text-gray-400">({preferredSize})</span>}
      </label>

      <div className="flex border border-gray-300 rounded overflow-hidden focus-within:border-accent">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 border-none rounded-none"
        >
          Choose File
        </button>

        <div className="flex items-center px-3 py-2">
          {!file ? (
            <span className="text-gray-500 text-sm">No file chosen</span>
          ) : (
            <div className="flex items-center border border-gray-300 bg-gray-100 rounded px-2 py-1 overflow-hidden">
              <span className="text-xs truncate max-w-[150px]">{file.name}</span>
              <button type="button" onClick={handleRemove} className="ml-2 text-gray-500 hover:text-gray-700">
                <Icon icon="mdi:close" width="16" />
              </button>
            </div>
          )}
        </div>

        <input type="file" accept="image/*" ref={fileInputRef} onChange={onChange} className="hidden" />
      </div>
    </div>
  );
};

export default StyledFileInput;
