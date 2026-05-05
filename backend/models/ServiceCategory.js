import mongoose from 'mongoose';

const serviceCategorySchema = mongoose.Schema({
    name : {
        type : "String",
        required : true
    },
    description : {
        type : String,
        required : true 
    },
    icon : {
        type : String,
        required : true
    }
})

const ServiceCategory = mongoose.model('ServiceCategory',serviceCategorySchema);
export default ServiceCategory;