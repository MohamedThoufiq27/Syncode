
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const OC_API = 'https://onecompiler-apis.p.rapidapi.com/api/v1/run';

const langMap = {
        'javascript' :  'js',
        'java' : 'java',
        'python' : 'py',
        'cpp' : 'cpp'
}

router.post('/',async (req,res)=>{
    const {code,language,input} = req.body;
    
    const langExt = langMap[language];
    if (!langExt) {
        return res.status(400).json({ error: 'Unsupported or missing language' });
    }
    // console.log(language);
    try{
        const submission = await axios.post(OC_API,
            
            {
                language:language,
                stdin:input,
                files:[{name:`Main.${langExt}`,content:code}]
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