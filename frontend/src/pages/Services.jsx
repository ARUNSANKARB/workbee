import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WorkerCard from '../components/cards/WorkerCard';
import Skeleton from '../components/common/Skeleton';
import useWorkerStore from '../store/workerStore';
import { workerAPI, categoryAPI } from '../services/api';

const Services = () => {
  const { workers, loading, setWorkers, setLoading, setFilters, filters } = useWorkerStore();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll({ isActive: true });
      setCategories(res.data.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchWorkers = async (filter) => {
    setLoading(true);
    try {
      let res;
      if(filter)
      {
        res= await workerAPI.getByCategory(filter);
      }
      else{
        res = await workerAPI.getAll();
      }
      setWorkers(res.data);
    } catch (error) {
      console.error('Failed to fetch the workers')
    } finally{
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFilters({ categoryId });
    fetchWorkers(categoryId);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await workerAPI.search({ query: search });
      setWorkers(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Search Section */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Find Services</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 flex gap-2 bg-light rounded-lg p-2">
              <FiSearch className="text-gray-400 my-auto" />
              <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <button type="submit" className="bg-primary text-dark px-6 py-2 rounded-lg font-bold hover:bg-primary-dark">
              Search
            </button>
          </form>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition ${
                  filters.categoryId === cat._id
                    ? 'bg-primary text-dark'
                    : 'bg-light text-secondary hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Workers Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg">
                <Skeleton height="h-20" className="mb-4" />
                <Skeleton height="h-4" className="mb-2" />
                <Skeleton height="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : workers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker._id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No workers found. Try a different search.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Services;
