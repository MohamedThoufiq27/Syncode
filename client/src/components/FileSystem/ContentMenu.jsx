// components/ContextMenu.jsx
import  { useEffect } from "react";

export function ContextMenu({ x, y, onClose, onAction }) {
  useEffect(() => {
    const handleClickOutside = () => onClose();
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside);
    };
  }, [onClose]);

  return (
    <ul
      className="absolute z-50 bg-white border shadow-md rounded-md text-sm py-1 w-40"
      style={{ top: y, left: x }}
    >
      <li
        className="px-3 py-2 hover:bg-zinc-100 cursor-pointer"
        onClick={() => onAction("rename")}
      >
        
        ✏️ Rename
      </li>
      <li
        className="px-3 py-2 hover:bg-zinc-100 cursor-pointer"
        onClick={() => onAction("addFile")}
      >
        📄 Add File
      </li>
      <li
        className="px-3 py-2 hover:bg-zinc-100 cursor-pointer"
        onClick={() => onAction("addFolder")}
      >
        📁 Add Folder
      </li>
      <li
        className="px-3 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
        onClick={() => onAction("delete")}
      >
        🗑️ Delete
      </li>
    </ul>
  );
}
