const JoiV=require('joi');

const schema=JoiV.object().keys({
    category_name:JoiV.string().required(),
    status:JoiV.number().required(),
});

module.exports={
    schema
}