
import { VscFile } from "react-icons/vsc";
import { fileIconMap } from "../components/FileSystem/fileIcons";

export const getFileExtension = (filename) => {
  const parts = filename.split(".");
  return (parts.length > 1) ? (parts.pop().toLowerCase()) : filename.toLowerCase(); // fallback to name
};

export const getFileIcon = (filename) => {
  const ext = getFileExtension(filename);
  return fileIconMap[ext] || <VscFile className="text-gray-400" />
};

