import  { useState } from 'react'
import { askAi } from '../../api'
import { IoSend } from 'react-icons/io5';
import { useSharedData } from '../../hooks/useSharedData';
import CodeMirror, { oneDark} from '@uiw/react-codemirror';
import CopyCode from './CopyCode';



const CodeGen = () => {
    const {GeneratedCode,setGeneratedCode} = useSharedData();
    const [prompt,setPrompt] = useState('');
    const [loading,setLoading] = useState(false);
    const [extensionsMap, setExtensionsMap] = useState({});


    const handlePrompt = async (prompt) => {
        if(prompt.trim().length>0){
            setLoading(true);
            const res = await askAi({prompt});
            setGeneratedCode([...GeneratedCode,res]);
            setPrompt('');
            setLoading(false);
        }
    }
    function extractLanguageAndCode(snippet) {
      const regex = /```(\w+)?\n([\s\S]*?)```/;
      const match = snippet.match(regex);

      if (match) {
        return {
          language: match[1] || 'plaintext',
          code: match[2].trim(),
        };
      }

      return {
        language: 'plaintext',
        code: snippet.trim(),
      };
  }

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

    
  return (
    <div className="h-full rounded-2xl flex flex-col">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                
                <div className="px-4 py-2">
                  {
                    GeneratedCode.map((rawSnippet,index)=>{
                        const { language, code } = extractLanguageAndCode(rawSnippet);
                        if (!extensionsMap[language]) {
                          loadLanguageExtension(language).then((ext) => {
                            setExtensionsMap((prev) => ({ ...prev, [language]: ext }));
                          });
                        }

                        const langExtension = extensionsMap[language];

                        return (
                        <div key={index} className='p-1.5 mb-3 bg-linear-to-br from-violet-500 to-pink-500 rounded-xl'>
                          <div className='p-1 w-full inline-flex justify-between'>
                            <span className='text-zinc-800 font-mono font-bold text-sm'>{language}</span>
                            <CopyCode textToCopy={code} />
                          </div>
                          
                          <CodeMirror 
                              className='p-3 overflow-auto dark:bg-gray-700 bg-white dark:text-white text-zinc-950 rounded-lg'
                              value={code}
                              extensions={langExtension ? [langExtension] : []}
                              theme={oneDark}
                              editable={false}
                          />
                        </div>  
                        );
                            // className='p-3 mb-3 overflow-auto dark:bg-gray-700 bg-white dark:text-white text-zinc-950 rounded-lg'>{code}</pre>
                    })
                  }
      
                    {/* <div ref={messagesEndRef}></div> */}
    
                </div>
            </div>
    
    
    
            <div className="p-2 shadow-2xl rounded-xl">
                <div className="flex items-center">
                    <input
                      value={prompt}
                      className={`bg-gray-700 w-full h-[3vw] rounded-3xl focus:outline-none px-4 dark:placeholder:text-gray-500 dark:caret-gray-400 dark:text-gray-300 disabled:opacity-50`} 
                      type='text' 
                      onChange={(e)=>setPrompt(e.target.value)}
                      onKeyDown={(e)=>e.key==='Enter' && !loading && handlePrompt(prompt)}
                      placeholder={loading ? 'Generating...' : 'Ask AI'}
                      autoFocus 
                      disabled={loading}
                    />
                    <button disabled={loading} onClick={()=>handlePrompt(prompt)} className="w-14 h-12 rounded-full bg-gray-700 text-gray-500 p-2 ml-1 flex justify-center items-center">
                      <IoSend className="size-5"/>
                      
                    </button>
                </div>
            </div>
        </div>
  )
}

export default CodeGen