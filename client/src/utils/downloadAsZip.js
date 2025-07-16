import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const addToZip = (zip, nodes) => {
    
  const walk = (node, zipFolder) => {
    if (node.isfolder) {
      const newFolder = zipFolder.folder(node.name);
      for (const child of node.folders || []) {
        walk(child, newFolder);
      }
    } else {
      zipFolder.file(node.name, node.content || '');
    }
  };

  for (const node of nodes) {
    walk(node, zip);
  }
};



export const downloadAsZip = async (tree, projectName = 'project') => {

  const zip = new JSZip();
  addToZip(zip, Array.isArray(tree) ? tree : [tree]);

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}.zip`);
};
