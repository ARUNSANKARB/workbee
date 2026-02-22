import { create } from 'zustand';

const useWorkerStore = create((set) => ({
  workers: [],
  selectedWorker: null,
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    categoryId: null,
    ratingMin: null,
    search: null,
    latitude: null,
    longitude: null,
  },

  setWorkers: (workers) => set({ workers }),
  setSelectedWorker: (worker) => set({ selectedWorker: worker }),
  setLoading: (loading) => set({ loading }),
  setPagination: (pagination) => set({ pagination }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),

  clearFilters: () => set({
    filters: {
      categoryId: null,
      ratingMin: null,
      search: null,
      latitude: null,
      longitude: null,
    },
    pagination: { page: 1, limit: 10, total: 0 },
  }),
}));

export default useWorkerStore;
