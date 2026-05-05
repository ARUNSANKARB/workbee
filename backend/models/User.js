import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String ,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true,
        },
        phone : {
            type : String,
            required : true
        },
        role : {
            type : String ,
            enum : ['customer','worker','admin'],
            required : true
        },
        area : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        aadharImage : {
            type : String,
        },
        isVerified : {
            type : Boolean,
            default : false
        },
        approved : {
            type : String,
            enum : ['approved','pending','rejected'],
            default : 'pending'
        },
        trustBadge : {
            type : Boolean,
            default : false
        },
        completedJobs : {
            type : Number,
            default : 0
        },
    },
    {
        timestamps : true
    }
)

userSchema.pre('save', async function()
{
    if(!this.isModified('password')) {return} ;
    this.password= await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword= async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model('User',userSchema);
export default User;