import {
  ChevronRightIcon,
  DocumentTextIcon,
  FolderIcon
} from "@heroicons/react/24/solid";
import {  useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence ,motion } from "framer-motion";
import { useSharedData } from "../../hooks/useSharedData";
import { getFileIcon } from "../../utils/getFileIcon";



export function Folder({ folder, handleTreeSearch, handleDelete, handleUpdate ,handleRightClick ,contextTarget,actionToTrigger,setContextTarget,setActionToTrigger,setSelectedFile }) {
  const [isOpen, setIsOpen] = useState(false);
  const {setCode,setActiveFile,setOpenFiles,openFiles} = useSharedData();
  const isAddingFile = contextTarget === folder.path && actionToTrigger === "addFile";
  const isAddingFolder = contextTarget === folder.path && actionToTrigger === "addFolder";
  const isEditing = contextTarget === folder.path && actionToTrigger === "rename";

  const onRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleRightClick(folder, e.pageX, e.pageY);
  };

  const resetContext = () => {
    setContextTarget(null);
    setActionToTrigger(null);
  }

  const onAddFolder = (e,isAddingFolder) => {
    if (e.key === "Enter" && e.target.value) {
      handleTreeSearch(folder.path, e.target.value, isAddingFolder);
      resetContext();
    }
    
  };

  const onUpdate = (e) => {
    if (e.key === "Enter" && e.target.value) {
      handleUpdate(folder.path, e.target.value);
      resetContext();
    }
  };

  const handleContent = () => {
    const alreadyOpen = openFiles.find(f => f.path === folder.path);

    if (alreadyOpen) {
        setActiveFile(alreadyOpen);
        setCode(alreadyOpen.content);
    }
    else if (!folder.isfolder) {
      setSelectedFile(folder);
      setActiveFile(folder);
      setCode(folder.content);

      setOpenFiles((prev) => {
        const alreadyOpen = prev.find(f => f.path === folder.path);
        if (alreadyOpen) return prev;
        return [...prev, folder]; 
      });
    }
    
  }


  const icon = folder.isfolder ? (
    <FolderIcon className="size-5 text-yellow-500" />
  ) : (
    <>{getFileIcon(folder.name)}</>
  );
  

  return (
    <li className="group relative" onContextMenu={onRightClick}>
      
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-1 py-1 rounded-md hover:text-white hover:bg-gray-900 cursor-pointer">
        <div className="w-4 h-full absolute left-0 top-0 border-l border-white dark:border-neutral-600"></div>
        {folder.isfolder && folder.folders?.length > 0 && (
          <button >
            <ChevronRightIcon
              className={`size-4 transition-transform ${isOpen ? "rotate-90" : ""} px-0.5`}
            />
          </button>
        )}

        {icon}

        {isEditing ? (
          <input
            className="w-20"
            onKeyDown={onUpdate}
            type="text"
            autoFocus
            defaultValue={folder.name}
            onBlur={resetContext}
          />
        ) : (
          <span onClick={handleContent} className={`truncate font-medium text-sm ${!folder.isfolder && 'cursor-pointer'}`} title={folder.path}>{folder.name}</span>
        )}
      </div>

      {(isAddingFile || isAddingFolder) && (
        <div className="flex items-center gap-2 pl-6 py-1">
          { isAddingFolder? (
            <FolderIcon className="size-5 text-blue-500" />
          ) : (
            <DocumentTextIcon className="size-5 text-gray-700" />
          )}
          <input
            type="text"
            className="w-32 px-1 border rounded text-sm bg-white"
            autoFocus
            placeholder={isAddingFolder ? "New Folder" : "New File"}
            onKeyDown={(e)=>onAddFolder(e,isAddingFolder)}
            onBlur={resetContext}
          />
        </div>
      )}

      <AnimatePresence initial={false}>
        {isOpen && folder.isfolder && folder.folders?.length > 0 && (
          <motion.ul
            className="pl-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {folder.folders.map((child) => (
              <Folder
                key={child.path}
                folder={child}
                handleTreeSearch={handleTreeSearch}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                handleRightClick={handleRightClick}
                contextTarget={contextTarget}
                actionToTrigger={actionToTrigger}
                setActionToTrigger={setActionToTrigger}
                setContextTarget={setContextTarget}
                setSelectedFile={setSelectedFile}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
