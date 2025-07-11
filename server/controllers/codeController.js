const Code = require('../models/model');


exports.saveCode=async (req,res)=>{
    const {roomid,language,tree}=req.body;
    try{
        const existing = await Code.findOne({roomid:roomid});
        if(existing){
            existing.language=language;
            existing.tree=tree;
            await existing.save();
        }
        else{
            await Code.create({roomid,language,tree});
        }
        res.status(200).json({'message':'Successfully saved'});
    }
    catch(err){
        res.status(500).json({'error':err.message});
    }
};

exports.getCode = async (req,res)=>{
    const {roomid}=req.params;
    try{
        const doc = await Code.findOne({roomid:roomid});
        res.status(200).json(doc || {});
    }
    catch(err){
        res.status(500).json({'error':err.message});
    }
};