

import CodeMirror, { oneDark,defaultLightThemeOption} from '@uiw/react-codemirror';
import { VscRunAll } from "react-icons/vsc";
import { EditorView } from '@codemirror/view';
import debounce from 'lodash/debounce';
import {  useEffect, useState,useRef } from "react";
import socket from '../../socket';
//import {useDebounce} from 'react-use';
import { getCode, saveCode ,runCode } from '../../api';
import Dropdown from './Dropdown';
import { autocompletion } from '@codemirror/autocomplete';
import { toast } from 'react-toastify';
import { useSharedData } from '../../hooks/useSharedData';
import { IoClose } from "react-icons/io5";
import useTreeHelper from '../../hooks/useTreeHelper';
import { getFileIcon } from '../../utils/getFileIcon';


const CodeEditor = ({roomid,language,setLanguage,setOutput,setLoading,setRunTime,Loading,input}) =>{
    const {code,setCode,openFiles,setActiveFile,setOpenFiles,activeFile,tree,setTree,username} = useSharedData();
    const {updateFileContentInTree} = useTreeHelper();
    const [editorTheme,setEditorTheme] = useState(oneDark);
    const [languageExtension, setLanguageExtension] = useState(null);
    const [editorHeight,setEditorHeight] = useState('400');
    const editorRef = useRef(null);
    const lastCursorPosRef = useRef(null);
    const ignoreCursorUntil = useRef(0);

    

    const emitCursorPosition = debounce((pos) => {
        if (!editorRef.current || !activeFile?.path) return;

        socket.emit('cursor-update', {
            roomid,
            userId: socket.id,
            username: username,
            filePath: activeFile.path,
            cursorPos: pos,
        });

        console.log("📤 (debounced) Emitting cursor at", pos, "for", username); 
    }, 100); // 100ms delay is smooth & responsive


    const cursorBroadcastExtension = EditorView.updateListener.of((update) => {
        const now = Date.now();
        if (now < ignoreCursorUntil.current) return;
        
        const pos = update.state.selection.main.head;
        if ((update.selectionSet || update.docChanged || pos !== lastCursorPosRef.current) && editorRef.current) {
            lastCursorPosRef.current = pos;

            emitCursorPosition(pos);
        }
    });

    const loadLanguageExtension = async (lang) => {
        switch (lang) {
            case "javascript":
            return (await import("@codemirror/lang-javascript")).javascript();
            case "typescript":
            return (await import("@codemirror/lang-javascript")).javascript({ typescript: true });
            case "python":
            return (await import("@codemirror/lang-python")).python();
            case "java":
            return (await import("@codemirror/lang-java")).java();
            case "cpp":
            return (await import("@codemirror/lang-cpp")).cpp();
            case "c":
            return (await import("@codemirror/lang-cpp")).cpp({ dialect: "c" });
            case "html":
            return (await import("@codemirror/lang-html")).html();
            case "css":
            return (await import("@codemirror/lang-css")).css();
            case "markdown":
            return (await import("@codemirror/lang-markdown")).markdown();
            case "json":
            return (await import("@codemirror/lang-json")).json();
            case "go":
            return (await import("@codemirror/lang-go")).go();
            case "php":
            return (await import("@codemirror/lang-php")).php();
            case "rust":
            return (await import("@codemirror/lang-rust")).rust();
            default:
            return (await import("@codemirror/lang-javascript")).javascript(); // default
        }
    };

    useEffect(() => {
        socket.on('remote-cursor-update', ({ userId, username, cursorPos, filePath }) => {
            if (
                userId === socket.id ||            // Ignore self
                !editorRef.current ||              // Editor not mounted
                filePath !== activeFile?.path ||   // Not current file
                cursorPos < 1                      // Ignore invalid or 0 position
            ) return;

            

            const editorRect = editorRef.current.dom.getBoundingClientRect();
            const coords = editorRef.current.coordsAtPos(cursorPos);
            if (!coords) return;

            const existing = document.getElementById(`cursor-${userId}`);
            if (existing) existing.remove();

            const tag = document.createElement("div");
            tag.id = `cursor-${userId}`;
            tag.textContent = username;
            tag.style.position = "absolute";
            tag.style.left = `${editorRect.left + coords.left -80}px`;
            tag.style.top = `${editorRect.top + coords.top - 200}px`;
            tag.style.background = "#6366f1";
            tag.style.color = "#fff";
            tag.style.padding = "2px 6px";
            tag.style.borderRadius = "4px";
            tag.style.fontSize = "12px";
            tag.style.pointerEvents = "none";
            tag.style.zIndex = "10";
            tag.classList.add('remote-cursor-label');

            document.body.appendChild(tag);
            console.log("🔁 Remote cursor from", username, userId, "at", cursorPos);


            setTimeout(() => tag.remove(), 5000); // auto-remove after 5 seconds
        });

        return () => {
            socket.off('remote-cursor-update');
        };
    }, [activeFile]);


    useEffect(() => {
        const loadLang = async () => {
            const ext = await loadLanguageExtension(language);
            setLanguageExtension(ext);
        };
        loadLang();
    }, [language]);

    useEffect(()=>{
        const handleEditorHeight = ()=>{
            const headerHeight = 210;
            const availableHeight = window.innerHeight-headerHeight;
            setEditorHeight( availableHeight);
        }

        handleEditorHeight();
        window.addEventListener('resize',handleEditorHeight);

        return ()=>window.removeEventListener('resize',handleEditorHeight);

    },[])

    useEffect(()=>{
        const theme = window.matchMedia("(prefers-color-scheme:dark)");
        const handleTheme = (e) => { 
            setEditorTheme(e.matches ? oneDark : defaultLightThemeOption);
        }
        theme.addEventListener('change',handleTheme);

        return ()=>theme.removeEventListener('change',handleTheme);
    },[]);
    

    const handleRun = async ({code,language,input})=>{
        setLoading(true);
        const {stdout,stderr,message,executionTime} = await runCode({code,language,input});
        setOutput( stdout || stderr || message || 'No output');
        setRunTime(executionTime);
        setLoading(false);
        toast.success(" Executed Successfully !")
    }
    
    useEffect(() => {
        socket.on('file-content-update', ({ filePath, content }) => {
            console.log("📥 Received file-content-update", filePath);

            setOpenFiles((prev) =>
                prev.map((f) =>
                    f.path === filePath ? { ...f, content } : f
                )
            );

            if (activeFile?.path === filePath) {
                const now = Date.now();
                ignoreCursorUntil.current = now + 200;
                setCode(content);
            }

            const updatedTree = updateFileContentInTree(tree, filePath, content);
        
            setTree(updatedTree);
        });

        return () => {
            socket.off('file-content-update');
        };
    }, [tree, activeFile]);
     

    

    useEffect(()=>{
        if(!roomid){
            return;
        }
        
        const load = async ()=>{
            const saved = await getCode(roomid);
            // if(saved.code && Object.values(defaultCodeSnippets).includes(saved.code)) setCode(defaultCodeSnippets[language]);
            // else{
            //     setCode(defaultCodeSnippets[language]);
            // }
            if(saved.language) setLanguage(saved.language);
            if(saved.tree) setTree(saved.tree);
        };

        load();

        socket.on('language-update',({language})=>{
            setLanguage(language);
        });

        return ()=>{
            socket.off('file-content-update');
            socket.off('language-update');
        };
    
    },[roomid,language]);

    // useEffect(() => {
    //     setCode(defaultCodeSnippets[language]);
    //     socket.emit('language-change', { roomid, language });
    // }, [language]);

    const handleCodeChange = async (value)=>{
        setCode(value);

        setOpenFiles((prev) =>
            prev.map((f) =>
            f.path === activeFile?.path ? { ...f, content: value } : f
            )
            
        );

        // ✅ Update activeFile (for immediate tab switching)
        if (activeFile) {
            setActiveFile({ ...activeFile, content: value });
        }

        // ✅ Update tree node content
        const updatedTree = updateFileContentInTree(tree, activeFile?.path, value);
        setTree(updatedTree);
        // socket.emit('tree-modified',updatedTree,roomid);
        console.log("🛰 Emitting file-content-change", activeFile?.path);
        if (activeFile?.path) {
            socket.emit('file-content-change', {
                roomid,
                filePath: activeFile.path,
                content: value,
            });
            console.log('file content sent');
        }
        await saveCode({roomid:roomid,language:language,tree:updatedTree});
    };

    const handleLanguageChange = async (language)=>{
        setLanguage(language);
        socket.emit('language-change',{roomid,language:language});
        await saveCode({roomid,language,tree});
    };

    
    
    return (
        <div className='p-1.5 m-1.5'>
            
                <div className='flex justify-end items-center '>
                        <div className='truncate flex-1 '>
                            <div className="tab-bar m-1 flex cursor-pointer overflow-x-auto no-scrollbar ">
                                {openFiles.map(file => (
                                    <div
                                    key={file.path}
                                    className={`relative py-2 tab ${file.path === activeFile?.path ? "active bg-gray-700" : ""} h-fit w-fit flex justify-center items-center text-center bg-gray-900 font-semibold gap-1  text-md text-white border-0 mr-2 hover:bg-gray-800 rounded-lg p-1.5`}
                                    onClick={() => {
                                        if (activeFile) {
                                            setOpenFiles(prevFiles =>
                                                prevFiles.map(f =>
                                                    f.path === activeFile.path ? { ...f, content: code } : f
                                                )
                                            );
                                        }
                                        setActiveFile(file);
                                        setCode(file.content);
                                    }}
                                    >
                                    {file.path === activeFile?.path &&
                                        (<div
                                        className={`absolute left-0 top-0 h-1.5 w-full rounded-t-lg transition-all duration-150 bg-linear-to-r from-pink-700 to-violet-700`}
                                        />)
                                    }
                                    {getFileIcon(file.name)}
                                    {file.name}

                                    <button className='mx-1 p-0.5 cursor-pointer hover:bg-zinc-400 rounded-md' onClick={(e) => {
                                        e.stopPropagation();

                                        if (activeFile?.path === file.path) {
                                            setOpenFiles(prevFiles =>
                                                prevFiles.map(f =>
                                                    f.path === file.path ? { ...f, content: code } : f
                                                )
                                            );
                                        }

                                        setOpenFiles(prev => prev.filter(f => f.path !== file.path));
                                        if (activeFile?.path === file.path) {
                                            const remainingFiles = openFiles.filter(f => f.path !== file.path);
                                            const nextFile = remainingFiles[0] || null;
                                            setActiveFile(nextFile);
                                            setCode(nextFile?.content || "");
                                        }
                                    }}><IoClose className='size-4'/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='mr-2 pb-1'>
                            <Dropdown language={language} onLanguageChange={handleLanguageChange}  />
                        </div>
                        
                        
                        <div>
                            <button onClick={()=>handleRun({code,language,input})} className="relative inline-flex items-center justify-center  overflow-hidden text-sm font-medium text-gray-900 rounded-lg  dark:text-white hover:ring-4 hover:outline-none hover:ring-purple-200 dark:hover:ring-purple-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md ">
                                {Loading ?<div className="w-6 h-6 rounded-full animate-spin
                        border-2 border-solid border-blue-500 border-t-transparent"></div> : 
                                <div className='px-2 text-2xl' ><VscRunAll /></div>}
                                </span>
                            </button>
                        </div>
                        
                </div>
           
            

            <div className=' overflow-auto no-scrollbar scroll-smooth rounded-xl ' style={{height:`${editorHeight}px`}}>
                {languageExtension &&
                <CodeMirror 
                    value={code}
                    height={`${editorHeight}px`}
                    theme={editorTheme}
                    extensions={[languageExtension,autocompletion(),cursorBroadcastExtension]}
                    onChange={(value)=>(handleCodeChange(value))}
                    onCreateEditor={(view) => {
                        editorRef.current = view;
                    }}
                />}
            </div>

        </div>
    );
};

export default CodeEditor;