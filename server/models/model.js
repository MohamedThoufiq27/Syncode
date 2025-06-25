const mongoose=require('mongoose');

const codeSchema= new mongoose.Schema({
    roomid:String,
    code:String,
    language:String
},{timestamps:true,versionKey:false});

module.exports=mongoose.model('Code',codeSchema);