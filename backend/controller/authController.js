import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async(req,res) => {
    console.log(req.body);
    try {
    const {name,email,password,phone,role,area,city} = req.body;
    const aadharImageUrl = req.file?.path;
    if(await User.findOne({email}))
    {
        return res.status(400).json({message:"Already registered"});
    }
    const user = await User.create({
     name, email, password, role, city, area, phone, aadharImage:aadharImageUrl
    })
    res.status(201).json({user});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const login = async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        console.log('password from DB:', user.password)
        console.log('entered password:', password)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const verify = await user.comparePassword(password)
        if(!verify)
        {
            return res.status(401).json({message:"Invalid Password"})
        }
        const token = generateToken(user._id,user.role);
        res.status(200).json({user,token});
    } catch(error)
    {
        res.status(500).json({message : error.message});
    }
}