import { Folder } from "./Folder";
import { useState } from "react";
import { ContextMenu } from "./ContentMenu";
import useTreeHelper from "../../hooks/useTreeHelper";
import { useSharedData } from "../../hooks/useSharedData";
import { TbFolderUp } from "react-icons/tb";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import socket from "../../socket";
import LZString from "lz-string";
import Tooltip from "../Tooltip/Tooltip";
import { saveCode } from "../../api";

export default function FileSystem() {
  const {insertNode,deleteNode,updateNode} = useTreeHelper();
  const {setSelectedFile,setCode,tree,setTree,setActiveFile,setOpenFiles,roomid,language} = useSharedData();
  
  const [context, setContext] = useState({ visible: false, x: 0, y: 0, target: null });
  const [contextTarget, setContextTarget] = useState(null);
  const [actionToTrigger, setActionToTrigger] = useState(null);  
  

  const handleRightClick = (folder, x, y) => {
    console.log("Right-clicked:", folder.name);
    setContext({ visible: true, x, y, target: folder });
  };

  const handleContextAction = (action) => {
    const target = context.target;
    if (!target) return;

    if (action === "rename"){
      setContextTarget(target.path);   // store folder to be renamed
      setActionToTrigger("rename");    // trigger rename in Folder component
    }
    
    if (action === "delete") handleDelete(target.path);

    if (action === "addFile" || action === "addFolder") {
    setContextTarget(target.path);
    setActionToTrigger(action); 
    }
    setContext({ ...context, visible: false });
  };

  
  const handleTreeSearch = (folderPath,item,isfolder) =>{
    const finalTree = insertNode(tree,folderPath,item,isfolder);
    setTree(finalTree);
    console.log("📤 Emitting tree-modified to room:", roomid, finalTree);
    const compressedTree = LZString.compressToBase64(JSON.stringify(finalTree));
    socket.emit("tree-modified",compressedTree,roomid);
  }

  const handleDelete = (fPath) => {
    const finalTree = deleteNode(tree,fPath);
    setTree(finalTree);
    console.log("📤 Emitting tree-modified to room:", roomid, finalTree);
    const compressedTree = LZString.compressToBase64(JSON.stringify(finalTree));
    socket.emit("tree-modified",compressedTree,roomid);
  }

  const handleUpdate = (fPath,newName) => {
    const finalTree = updateNode(tree,fPath,newName);
    console.log(finalTree);
    setTree(finalTree);

    console.log("📤 Emitting tree-modified to room:", roomid, finalTree);
    const compressedTree = LZString.compressToBase64(JSON.stringify(finalTree));
    socket.emit("tree-modified",compressedTree,roomid);
  }

  const handleImport = async (e) => {
    const files = Array.from(e.target.files);
    const root = {};

    for (const file of files) {
      const pathParts = file.webkitRelativePath.split("/");
      let current = root;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];

        if (i === pathParts.length - 1) {
          const content = await file.text();
          // FILE node
          current[part] = {
            name: part,
            isfolder: false,
            content:content || ""
          };
        } else {
          // FOLDER node
          if (!current[part]) {
            current[part] = {
              name: part,
              isfolder: true,
              folders: {}
            };
          }
          current = current[part].folders;
        }
      }
    }
    
  // Convert object tree to your folder array format
    const toFolderArrayFormat = (nodeObj) => {
      return Object.values(nodeObj).map((node) => {
        if (node.isfolder) {
          return {
            name: node.name,
            isfolder: true,
            path:"",
            folders: toFolderArrayFormat(node.folders)
          };
        } else {
          return {
            name: node.name,
            isfolder: false,
            path:"",
            content:node.content
          };
        }
      });
    };

    const rootFolders = toFolderArrayFormat(root);

    function assignPaths(node, currentPath = "") {
      const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
      node.path = fullPath;

      if (node.isfolder && node.folders) {
        node.folders.forEach(child => assignPaths(child, fullPath));
      }

      return node;
    }

    if (rootFolders.length === 1 && rootFolders[0].isfolder) {
      const rootNode = assignPaths(rootFolders[0]);
      console.log("📤 Emitting tree-modified to room:", roomid,rootNode);
      const compressedTree = LZString.compressToBase64(JSON.stringify(rootNode));
      setTree(rootNode);
      await saveCode({roomid,language,tree:rootNode});
      socket.emit("tree-modified",compressedTree,roomid);

    } else {
          const fallbackRoot = {
            name: "Root",
            isfolder: true,
            folders: toFolderArrayFormat(root),
            path: "Root"
          };

          const updatedTree=assignPaths(fallbackRoot);
          setTree(updatedTree);
          console.log("📤 Emitting tree-modified to room:", roomid, updatedTree);
          await saveCode({roomid,language,tree:updatedTree});
          const compressedTree = LZString.compressToBase64(JSON.stringify(updatedTree));
          socket.emit("tree-modified",compressedTree,roomid);
      }
  };

  const handleSingleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const content = await file.text();

    const fileNode = {
      name: file.name,
      isfolder: false,
      content,
      path: tree ? `${tree.path}/${file.name}` : `Root/${file.name}`,
    };

    // If no tree exists, initialize a root
    if (!tree) {
      const defaultRoot = {
        name: "Root",
        isfolder: true,
        folders: [],
        path: "Root",
      };
      setTree({
        ...defaultRoot,
        folders: [fileNode]
      });
      setSelectedFile(fileNode);
      setCode(content);
      return;
    }
    
    setOpenFiles((prev) => {
      const alreadyOpen = prev.find(f => f.path === file.path);
      if (alreadyOpen) return prev;
      return [...prev, file];
    });

    
    setActiveFile(file);
    // Else insert into existing root
    const updatedTree = insertNode(tree, tree.path, file.name, false, content);
    setTree(updatedTree);
    setSelectedFile(fileNode);
    setCode(content);
    console.log("📤 Emitting tree-modified to room:", roomid, updatedTree);
    const compressedTree = LZString.compressToBase64(JSON.stringify(updatedTree));
    socket.emit("tree-modified",compressedTree,roomid);
    await saveCode({roomid,language, tree:updatedTree});
};

  return(
    <div className="p-1 max-w-full h-full flex flex-col overflow-auto no-scrollbar">
  {/* Header with upload buttons */}

  <div className="pt-2 pr-2 rounded-t-2xl flex justify-end items-center gap-1">
    <Tooltip text='Import Folder' position="left">
    <label htmlFor="folderUpload" className="btn btn-primary cursor-pointer">
      <TbFolderUp className="size-6 text-zinc-800" />
    </label>
    </Tooltip>
    <input
      id="folderUpload"
      type="file"
      webkitdirectory="true"
      directory=""
      multiple
      className="hidden"
      onChange={handleImport}
    />

    <input
      type="file"
      onChange={handleSingleFile}
      className="hidden"
      id="singleFileInput"
    />
    <Tooltip text='Import File' position="left">
      <label htmlFor="singleFileInput"  className="btn cursor-pointer">
        <BsFileEarmarkArrowUp className="size-6 text-zinc-800" />
      </label>
    </Tooltip>
  </div>

  {/* Main content area (tree or fallback) */}
  <div className="flex-1">
    {tree ? (
      <ul>
        <Folder
          folder={tree}
          handleTreeSearch={handleTreeSearch}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleRightClick={handleRightClick}
          contextTarget={contextTarget}
          actionToTrigger={actionToTrigger}
          setContextTarget={setContextTarget}
          setActionToTrigger={setActionToTrigger}
          setSelectedFile={setSelectedFile}
          key={tree.path}
        />
      </ul>
    ) : (
      <div className="h-full w-full flex justify-center items-center">
        <div className="text-md text-center text-zinc-700">
          Import Any Folder or File to See
        </div>
      </div>
    )}
  </div>

  {/* Context Menu */}
  {context.visible && (
    <ContextMenu
      x={context.x}
      y={context.y}
      onClose={() => setContext({ ...context, visible: false })}
      onAction={handleContextAction}
    />
  )}
</div>

  );
}





