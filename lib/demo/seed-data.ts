// Demo seed data for testing purposes
// This file contains fictional data to showcase the app functionality

export const demoProperties = [
  {
    id: 'demo-1',
    title: 'Modern Coliving Space in Brussels Center',
    description: 'Beautiful modern apartment perfect for young professionals. Fully furnished with high-speed internet, shared kitchen, and cozy common areas.',
    city: 'Brussels',
    postal_code: '1000',
    monthly_rent: 750,
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'coliving',
    status: 'published',
    created_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Spacious House Share in Ghent',
    description: 'Large house with private bedrooms and shared living spaces. Garden access, bike storage, and great public transport connections.',
    city: 'Ghent',
    postal_code: '9000',
    monthly_rent: 650,
    bedrooms: 3,
    bathrooms: 2,
    property_type: 'house',
    status: 'published',
    created_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Studio Apartment near EU Quarter',
    description: 'Cozy studio perfect for students or interns. Walking distance to European institutions, metro, and shopping.',
    city: 'Brussels',
    postal_code: '1040',
    monthly_rent: 850,
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'studio',
    status: 'published',
    created_at: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Charming Apartment in Antwerp',
    description: 'Historic building with modern amenities. Shared rooftop terrace, laundry facilities, and friendly community atmosphere.',
    city: 'Antwerp',
    postal_code: '2000',
    monthly_rent: 700,
    bedrooms: 2,
    bathrooms: 1,
    property_type: 'apartment',
    status: 'published',
    created_at: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Luxury Coliving in Brussels',
    description: 'Premium coliving space with gym, cinema room, and coworking space. All utilities included, weekly cleaning service.',
    city: 'Brussels',
    postal_code: '1050',
    monthly_rent: 1200,
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'coliving',
    status: 'published',
    created_at: new Date('2024-02-05').toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Student-Friendly House in Leuven',
    description: 'Perfect for students! Near university campus, bike-friendly, shared study room, and fast internet.',
    city: 'Leuven',
    postal_code: '3000',
    monthly_rent: 500,
    bedrooms: 4,
    bathrooms: 2,
    property_type: 'house',
    status: 'published',
    created_at: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'demo-7',
    title: 'Eco-Friendly Apartment in Liège',
    description: 'Sustainable living space with solar panels, rainwater collection, and organic garden. Green community focused.',
    city: 'Liège',
    postal_code: '4000',
    monthly_rent: 680,
    bedrooms: 2,
    bathrooms: 1,
    property_type: 'apartment',
    status: 'published',
    created_at: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'demo-8',
    title: 'Downtown Studio in Bruges',
    description: 'Perfectly located studio in the heart of historic Bruges. Close to restaurants, shops, and cultural attractions.',
    city: 'Bruges',
    postal_code: '8000',
    monthly_rent: 900,
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'studio',
    status: 'published',
    created_at: new Date('2024-02-20').toISOString(),
  },
];

export const demoUsers = [
  {
    email: 'demo.searcher@easyco.demo',
    password: 'Demo2024!',
    full_name: 'Emma Searcher',
    user_type: 'searcher',
    role: 'Searcher - Looking for coliving',
  },
  {
    email: 'demo.owner@easyco.demo',
    password: 'Demo2024!',
    full_name: 'Lucas Owner',
    user_type: 'owner',
    role: 'Property Owner',
  },
  {
    email: 'demo.resident@easyco.demo',
    password: 'Demo2024!',
    full_name: 'Sophie Resident',
    user_type: 'resident',
    role: 'Current Resident',
  },
];

export const demoConversations = [
  {
    id: 'conv-1',
    user_name: 'Lucas Owner',
    last_message: 'Hello! Is the apartment still available?',
    timestamp: '2 hours ago',
    unread: 2,
  },
  {
    id: 'conv-2',
    user_name: 'Sophie Resident',
    last_message: 'Thanks for the info about the community event!',
    timestamp: 'Yesterday',
    unread: 0,
  },
];

export const demoMessages = [
  {
    id: 'msg-1',
    text: 'Hello! Is the apartment still available?',
    timestamp: '14:30',
    isOwn: false,
  },
  {
    id: 'msg-2',
    text: 'Yes, it is! Would you like to schedule a viewing?',
    timestamp: '14:35',
    isOwn: true,
  },
  {
    id: 'msg-3',
    text: 'That would be great! I am available this weekend.',
    timestamp: '14:37',
    isOwn: false,
  },
];

export const demoRoommates = [
  {
    id: 'room-1',
    name: 'Alex Martin',
    role: 'Student',
  },
  {
    id: 'room-2',
    name: 'Marie Dubois',
    role: 'Young Professional',
  },
  {
    id: 'room-3',
    name: 'Tom Jensen',
    role: 'Freelancer',
  },
];

export const demoEvents = [
  {
    id: 'event-1',
    title: 'Community Dinner',
    date: 'Friday, Mar 15 at 19:00',
    location: 'Common Kitchen',
    description: 'Monthly potluck dinner. Bring a dish to share!',
  },
  {
    id: 'event-2',
    title: 'Movie Night',
    date: 'Saturday, Mar 16 at 20:00',
    location: 'Living Room',
    description: 'Vote for the movie in the group chat!',
  },
];

// Helper function to check if we're in demo mode
export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

// Helper to get demo data
export const getDemoProperties = () => demoProperties;
export const getDemoUsers = () => demoUsers;
export const getDemoConversations = () => demoConversations;
export const getDemoMessages = () => demoMessages;
export const getDemoRoommates = () => demoRoommates;
export const getDemoEvents = () => demoEvents;
