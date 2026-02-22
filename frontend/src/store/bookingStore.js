import { create } from 'zustand';

const useBookingStore = create((set) => ({
  bookings: [],
  selectedBooking: null,
  loading: false,
  filters: {
    status: null,
    page: 1,
    limit: 10,
  },

  setBookings: (bookings) => set({ bookings }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setLoading: (loading) => set({ loading }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),

  addBooking: (booking) => set((state) => ({
    bookings: [booking, ...state.bookings],
  })),

  updateBooking: (bookingId, updates) => set((state) => ({
    bookings: state.bookings.map((b) =>
      b._id === bookingId ? { ...b, ...updates } : b
    ),
  })),

  clearFilters: () => set({
    filters: { status: null, page: 1, limit: 10 },
  }),
}));

export default useBookingStore;
