
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const OC_API = 'https://onecompiler-apis.p.rapidapi.com/api/v1/run';

const langMap = {
  javascript: 'js',
  java: 'java',
  python: 'py',
  cpp: 'cpp',
  c: 'c',
  csharp: 'cs',
  typescript: 'ts',
  php: 'php',
  ruby: 'rb',
  go: 'go',
  rust: 'rs',
  swift: 'swift',
  kotlin: 'kt',
  scala: 'scala',
  bash: 'sh',
  html: 'html',
  sql: 'sql',
  mysql: 'sql',
  postgresql: 'sql',
  sqlite: 'sql',
  mongodb: 'js',
  r: 'r',
  perl: 'pl',
  dart: 'dart',
  deno: 'ts',
  bun: 'js',
  vb: 'vb',
  objectivec: 'm',
  assembly: 'asm',
  fortran: 'f90',
  lua: 'lua',
  haskell: 'hs',
  clojure: 'clj',
  ocaml: 'ml',
  prolog: 'pl',
  pascal: 'pas',
  cobol: 'cob',
  elixir: 'ex',
  erlang: 'erl',
  groovy: 'groovy',
  jshell: 'jshell',
  fsharp: 'fs',
  commonlisp: 'lisp',
  racket: 'rkt',
  ada: 'adb',
  tcl: 'tcl',
  brainfk: 'bf',
  coffeescript: 'coffee',
  ejs: 'ejs',
  objectivec: 'm',
  basic: 'bas',
  plsql: 'sql',
  oracle: 'sql',
  redis: 'txt',
  mariadb: 'sql',
  sqlserver: 'sql'
};
const files = [];


router.post('/',async (req,res)=>{
    console.log(req.body);
    const {code,language,input} = req.body;
    const langExt = langMap[language];
    if (language === 'html') {
    files.push({
        name: 'index.html',
        content: code // raw HTML code
    });
    } else {
    files.push({
        name: `Main.${langExt}`,
        content: code
    });
    }
    
    if (!langExt) {
        return res.status(400).json({ error: 'Unsupported or missing language' });
    }
    // console.log(language);
    try{
        const submission = await axios.post(OC_API,
            
            {
                language:language,
                stdin:input,
                files:files
            }
        ,
            {
            headers:{
                'X-RapidAPI-Key':process.env.X_RapidAPI_Key,
                'x-rapidapi-host':'onecompiler-apis.p.rapidapi.com',
                'Content-Type':'application/json'
            }
        }
        );
       
        res.json(submission.data);
        
    }catch(error){
         console.error('Execution error:', error.message);
        return res.status(500).json({
            error: 'Execution Failed',
            detail: error.response?.data || error.message,
        });
    }
});

module.exports=router;