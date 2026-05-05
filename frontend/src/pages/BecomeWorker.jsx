import {useState} from 'react';
import {skillAPI} from '../services/api'
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../store/authStore";
import Button from '../components/common/Button';

const BecomeWorker = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [formData,setFormData] = useState({
        skills : '',
        experience : '',
        hourlyRate : '',
        bio : '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await skillAPI.create(formData);
            navigate('/worker-dashboard');
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    return(
        <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

    {/* Header */}
    <div className="text-center mb-8">
      <span className="text-4xl">🛠️</span>
      <h1 className="text-2xl font-bold text-secondary mt-2">
        Register Your Skills
      </h1>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Skills */}
      <input
        type="text"
        name="skills"
        placeholder="Skills (e.g. Electrician)"
        value={formData.skills}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
      />

      {/* Experience */}
      <input
        type="number"
        name="experience"
        placeholder="Experience (years)"
        value={formData.experience}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
      />

      {/* Hourly Rate */}
      <input
        type="number"
        name="hourlyRate"
        placeholder="Hourly Rate"
        value={formData.hourlyRate}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
      />

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Short Bio"
        value={formData.bio}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
      />

      {/* Submit */}
      <Button type="submit" className="w-full" >
        Submit
      </Button>

    </form>
  </div>
</div>
    )
}

export default BecomeWorker;