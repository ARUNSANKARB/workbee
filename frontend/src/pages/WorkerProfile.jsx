import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { workerAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await workerAPI.getProfile(id);
      setProfile(res.data.data.profile || res.data.data);
    } catch (err) {
      console.error('Failed to load worker profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    navigate(`/booking/create?workerId=${id}`);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Card>
              <img src={profile.userId.profileImage} alt={profile.userId.name} className="w-full h-56 object-cover rounded-lg" />
              <h2 className="text-2xl font-bold mt-4">{profile.userId.name}</h2>
              <p className="text-gray-600">{profile.title || profile.skills?.join(', ')}</p>
              <div className="mt-4">
                <Button onClick={handleBook} size="lg">Book Now</Button>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <h3 className="text-xl font-bold mb-4">About</h3>
              <p className="text-gray-700 mb-4">{profile.bio || 'No bio provided.'}</p>

              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex gap-2 flex-wrap mb-4">
                {(profile.skills || []).map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-primary rounded-full text-dark font-medium">{s}</span>
                ))}
              </div>

              <h4 className="font-semibold mb-2">Reviews</h4>
              <div className="space-y-3">
                {(profile.reviews || []).length === 0 && <p className="text-gray-600">No reviews yet.</p>}
                {(profile.reviews || []).map((r) => (
                  <div key={r._id} className="border p-3 rounded">
                    <div className="flex justify-between">
                      <div className="font-semibold">{r.customerName || r.customer?.name}</div>
                      <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-gray-700 mt-2">{r.comment}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkerProfile;
