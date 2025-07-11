
const useTreeHelper = () => {

    function insertNode(tree,folderPath,item,isfolder,content=''){
        // console.log(tree.folders)
        // // console.log(tree.folders.length); 
        
        if(tree.isfolder === false) return ;
        if(tree.isfolder && tree.path===folderPath ){
            tree.folders.unshift({
                name:item,
                isfolder,
                path:(tree.path ? `${tree.path}/${item}` : item),
                ...(isfolder ? {folders:[]}:{content})              
            })
        }
        for(let i=0;i<tree.folders.length;i++){
            insertNode(tree.folders[i],folderPath,item,isfolder);
        }
        return tree;
    }

    function deleteNode(tree, fPath) {
        // Validate input
        if (!tree || !tree.isfolder || !Array.isArray(tree.folders)) {
            return tree; // Return unchanged tree if invalid
        }

        // Create a shallow copy of the tree to avoid mutating the input
        const newTree = { ...tree, folders: [...tree.folders] };

        // Iterate in reverse for safe deletion
        for (let i=0;i<tree.folders.length;i++) {
            const child = newTree.folders[i];
            if (
                !child ||
                !Object.prototype.hasOwnProperty.call(child, 'name') ||
                !Object.prototype.hasOwnProperty.call(child, 'isfolder')
            ) {
                continue; // Skip invalid nodes
            }
            if (child.path === fPath) {
                newTree.folders.splice(i, 1); // Remove matching folder
            } else if (child.isfolder) {
                // Recursively update child folder
                newTree.folders[i] = deleteNode(child, fPath);
            }
        }

        return newTree; // Return the modified tree
    }

    function updateNode(tree, fPath, newName) {
        if (!tree || !tree.isfolder || !Array.isArray(tree.folders)) {
            return tree;
        }

        // Deep copy the tree
        const newTree = { ...tree, folders: [...tree.folders] };

        for (let i = 0; i < newTree.folders.length; i++) {
            const child = newTree.folders[i];
            if (!child || typeof child.path !== "string") continue;

            if (child.path === fPath) {
            const pathParts = fPath.split("/");
            pathParts[pathParts.length - 1] = newName;
            const newPath = pathParts.join("/");

            child.name = newName;
            child.path = newPath;

            // If it's a folder, recursively update paths of its children
            if (child.isfolder && Array.isArray(child.folders)) {
                child.folders = updateChildPaths(child.folders, fPath, newPath);
            }

            newTree.folders[i] = child;
            } else if (child.isfolder) {
            newTree.folders[i] = updateNode(child, fPath, newName);
            }
        }

        return newTree;
    }

    function updateChildPaths(children, oldParentPath, newParentPath) {
        return children.map((child) => {
            const relativePath = child.path.replace(oldParentPath, "");
            const newPath = newParentPath + relativePath;

            const updatedChild = { ...child, path: newPath };

            if (updatedChild.isfolder && updatedChild.folders) {
            updatedChild.folders = updateChildPaths(
                updatedChild.folders,
                child.path,
                newPath
            );
            }

            return updatedChild;
        });
    }

    function updateFileContentInTree(tree, path, newContent) {
        if (!tree) return tree;

        const updateNode = (node) => {
            if (node.path === path && !node.isfolder) {
            return { ...node, content: newContent };
            }

            if (node.isfolder && node.folders) {
            return {
                ...node,
                folders: node.folders.map(updateNode),
            };
            }

            return node;
        };

        return updateNode(tree);
    }

    return {insertNode,deleteNode,updateNode,updateFileContentInTree}
}

export default useTreeHelper