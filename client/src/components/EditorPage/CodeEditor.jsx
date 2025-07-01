//import socket from "../socket";

import CodeMirror, { oneDark,defaultLightThemeOption} from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { VscRunAll } from "react-icons/vsc";

import {  useEffect, useState } from "react";
import socket from '../../socket';
//import {useDebounce} from 'react-use';
import { getCode, saveCode ,runCode } from '../../api';
import Dropdown from './Dropdown';
import { autocompletion } from '@codemirror/autocomplete';
import { toast } from 'react-toastify';




const defaultCodeSnippets = {
  javascript: `// JavaScript Example
function greet(name) {
  return "Hello, " + name;
}
console.log(greet("World"));`,

  python: `# Python Example
def greet(name):
    return "Hello, " + name

print(greet("World"))`,

  cpp: `// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,

  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
};



const CodeEditor = ({roomid,language,setLanguage,setOutput,setLoading,setRunTime,Loading,input}) =>{
    const [code,setCode]=useState(defaultCodeSnippets[language]);
    const [editorTheme,setEditorTheme] = useState(oneDark);
    

    const [editorHeight,setEditorHeight] = useState('400');

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
    
    const getLanguage = (language)=>{
        switch(language)
        {
            case 'javascript' : return javascript();
            case 'python' : return python();
            case 'cpp' : return cpp();
            case 'java' : return java();
            default: return javascript();
        }   
    }

    

    useEffect(()=>{
        if(!roomid){
            return;
        }
        
        const load = async ()=>{
            const saved = await getCode(roomid);
            if(saved.code && Object.values(defaultCodeSnippets).includes(saved.code)) setCode(defaultCodeSnippets[language]);
            else if(saved.code){
               setCode(saved.code);
            }
            else{
                setCode(defaultCodeSnippets[language]);
            }
            if(saved.language) setLanguage(saved.language);
        };

        load();

        socket.on('code-update',(incomingCode)=>{
            setCode(incomingCode);
        });

        socket.on('language-update',({language})=>{
            setLanguage(language);
        });

        return ()=>{
            socket.off('code-update');
            socket.off('language-update');
        };
    
    },[roomid,language]);

    // useEffect(() => {
    //     setCode(defaultCodeSnippets[language]);
    //     socket.emit('language-change', { roomid, language });
    // }, [language]);

    const handleCodeChange = async (value)=>{
        setCode(value);
        socket.emit('code-change',{roomid,code:value});
        await saveCode({roomid:roomid,code:value,language:language});
    };

    const handleLanguageChange = async (language)=>{
        setLanguage(language);
        socket.emit('language-change',{roomid,language:language});
        await saveCode({roomid,code,language});
    };

    return (
        <div className='p-1.5 m-1.5'>
            <div className='mb-1 flex justify-between'>
                    <div className='mr-2'>
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
                <CodeMirror 
                    value={code}
                    height={`${editorHeight}px`}
                    theme={editorTheme}
                    extensions={[getLanguage(language),autocompletion()]}
                    onChange={(value)=>(handleCodeChange(value))}
                />
            </div>

        </div>
    );
};

export default CodeEditor;