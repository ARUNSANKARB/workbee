import skilledProfile from '../models/SkillProfile.js';

export const getList = async (req,res) => {
    try {
        const skills = await skilledProfile.find().populate("userId");
        res.json(skills);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const viewPerson = async (req,res) => {
    try {
        const person = await skilledProfile.findById(req.params.id).populate('userId');
        if(!person)
        {
            return res.status(404).json({message:"Person Not Found"});
        }
        res.json(person);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const viewByCategory = async(req,res) => {
    try {
        const category = await skilledProfile.find({skills:req.params.filter}).populate("userId");
        res.json(category);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const newSkill = async(req,res) => {
    try {
        const skill = await skilledProfile.create({...req.body,userId:req.user._id,isAvailable:true});
        res.status(201).json(skill);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const updateProfile = async(req,res) => {
    try {
        const oldSkill = await skilledProfile.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new:true});
        if (!oldSkill) {
             return res.status(404).json({ message: 'Profile not found' })
                }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}