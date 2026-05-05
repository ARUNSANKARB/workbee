import express from 'express'
import {getList,viewPerson,viewByCategory,newSkill,updateProfile} from '../controller/skillController.js'
import auth from '../middleware/auth.js'
const router = express.Router();

router.get('/',getList);
router.get('/:id',viewPerson);
router.get('/category/:filter',viewByCategory);

router.post('/',auth,newSkill);
router.put('/:id',auth,updateProfile);

export default router;