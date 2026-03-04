import { DatePlan } from '@/types/datePlan';

export const mockDatePlans: DatePlan[] = [
  {
    id: 'mg-road-romantic-evening',
    title: 'MG Road Romantic Evening',
    subtitle: 'The Classic Cubbon Park Date',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    totalCost: 1500,
    duration: 210, // 3.5 hours
    area: 'MG Road',
    vibe: 'romantic',
    timeOfDay: 'evening',
    tags: ['romantic', 'classic', 'outdoor', 'dinner'],
    isFeatured: true,
    likes: 234,
    stops: [
      {
        id: 'cafe-noir',
        name: 'Cafe Noir',
        type: 'cafe',
        description: 'Cozy European-style cafe for coffee and pastries',
        estimatedCost: 400,
        duration: 45,
        address: '182, Brigade Road, Bengaluru',
        coordinates: { lat: 12.9716, lng: 77.6073 },
        tips: 'Try their signature cold coffee',
        googleMapsUrl: 'https://maps.google.com/?q=Cafe+Noir+Brigade+Road'
      },
      {
        id: 'cubbon-park',
        name: 'Cubbon Park Walk',
        type: 'park',
        description: 'Romantic walk through Bangalore\'s green lung',
        estimatedCost: 0,
        duration: 40,
        address: 'Kasturba Road, Bengaluru',
        coordinates: { lat: 12.9763, lng: 77.5929 },
        tips: 'Visit during golden hour for best photos',
        googleMapsUrl: 'https://maps.google.com/?q=Cubbon+Park'
      },
      {
        id: 'corner-house',
        name: 'Corner House',
        type: 'dessert',
        description: 'Iconic Bangalore ice cream parlor',
        estimatedCost: 250,
        duration: 30,
        address: '5, St. Marks Road, Bengaluru',
        coordinates: { lat: 12.9725, lng: 77.5990 },
        tips: 'Death by Chocolate is a must-try!',
        googleMapsUrl: 'https://maps.google.com/?q=Corner+House+St+Marks'
      },
      {
        id: 'toit-rooftop',
        name: 'Toit Rooftop',
        type: 'restaurant',
        description: 'Craft beer and dinner with city views',
        estimatedCost: 850,
        duration: 90,
        address: '298, 100 Feet Road, Indiranagar',
        coordinates: { lat: 12.9784, lng: 77.6408 },
        tips: 'Book a rooftop table in advance',
        googleMapsUrl: 'https://maps.google.com/?q=Toit+Indiranagar'
      }
    ]
  },
  {
    id: 'indiranagar-coffee-dessert',
    title: 'Indiranagar Coffee & Dessert Trail',
    subtitle: 'The Indiranagar Cafe Hopping Date',
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    totalCost: 1200,
    duration: 180, // 3 hours
    area: 'Indiranagar',
    vibe: 'chill',
    timeOfDay: 'afternoon',
    tags: ['coffee', 'dessert', 'cafe-hopping', 'chill'],
    isFeatured: true,
    likes: 189,
    stops: [
      {
        id: 'third-wave-coffee',
        name: 'Third Wave Coffee',
        type: 'cafe',
        description: 'Specialty coffee in a minimalist setting',
        estimatedCost: 350,
        duration: 45,
        address: '100 Feet Road, Indiranagar',
        coordinates: { lat: 12.9716, lng: 77.6412 },
        tips: 'Their pour-over coffee is exceptional',
        googleMapsUrl: 'https://maps.google.com/?q=Third+Wave+Coffee+Indiranagar'
      },
      {
        id: 'smoor-indiranagar',
        name: 'Smoor Chocolate',
        type: 'dessert',
        description: 'Luxury chocolate and dessert destination',
        estimatedCost: 450,
        duration: 40,
        address: '100 Feet Road, Indiranagar',
        coordinates: { lat: 12.9780, lng: 77.6390 },
        tips: 'The hot chocolate is divine',
        googleMapsUrl: 'https://maps.google.com/?q=Smoor+Indiranagar'
      },
      {
        id: 'hole-in-wall',
        name: 'Hole in the Wall Cafe',
        type: 'cafe',
        description: 'Quirky cafe with great food and vibes',
        estimatedCost: 400,
        duration: 50,
        address: '4, 12th Main Rd, HAL 2nd Stage',
        coordinates: { lat: 12.9610, lng: 77.6387 },
        tips: 'Their sandwiches are legendary',
        googleMapsUrl: 'https://maps.google.com/?q=Hole+in+Wall+Indiranagar'
      }
    ]
  },
  {
    id: 'koramangala-foodie-trail',
    title: 'Koramangala Foodie Adventure',
    subtitle: 'The Ultimate Koramangala Food Crawl',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    totalCost: 2000,
    duration: 240, // 4 hours
    area: 'Koramangala',
    vibe: 'foodie',
    timeOfDay: 'evening',
    tags: ['food', 'drinks', 'trendy', 'dinner'],
    isFeatured: false,
    likes: 156,
    stops: [
      {
        id: 'truffles',
        name: 'Truffles',
        type: 'restaurant',
        description: 'Bangalore\'s legendary burger joint',
        estimatedCost: 600,
        duration: 60,
        address: 'St. Johns Road, Koramangala',
        coordinates: { lat: 12.9352, lng: 77.6245 },
        tips: 'The All American Cheese Burger is iconic',
        googleMapsUrl: 'https://maps.google.com/?q=Truffles+Koramangala'
      },
      {
        id: 'glen-ice-cream',
        name: 'Glen\'s Bakehouse',
        type: 'dessert',
        description: 'Artisanal bakery with amazing cakes',
        estimatedCost: 350,
        duration: 30,
        address: '6th Block, Koramangala',
        coordinates: { lat: 12.9340, lng: 77.6220 },
        tips: 'Try the Death by Chocolate cake',
        googleMapsUrl: 'https://maps.google.com/?q=Glens+Bakehouse+Koramangala'
      },
      {
        id: 'arbor-brewing',
        name: 'Arbor Brewing Company',
        type: 'bar',
        description: 'Craft brewery with great ambiance',
        estimatedCost: 800,
        duration: 90,
        address: '8, 3rd Cross, Koramangala',
        coordinates: { lat: 12.9348, lng: 77.6157 },
        tips: 'Their Bangalore Bliss is a must-try',
        googleMapsUrl: 'https://maps.google.com/?q=Arbor+Brewing+Koramangala'
      },
      {
        id: 'haagen-dazs',
        name: 'Haagen Dazs',
        type: 'dessert',
        description: 'Premium ice cream to end the night',
        estimatedCost: 250,
        duration: 30,
        address: 'Forum Mall, Koramangala',
        coordinates: { lat: 12.9344, lng: 77.6112 },
        tips: 'Belgian Chocolate is heavenly',
        googleMapsUrl: 'https://maps.google.com/?q=Haagen+Dazs+Forum+Mall'
      }
    ]
  },
  {
    id: 'budget-lalbagh-date',
    title: 'Budget Lalbagh Morning',
    subtitle: 'The Perfect Budget-Friendly Date',
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    totalCost: 500,
    duration: 180, // 3 hours
    area: 'Lalbagh',
    vibe: 'budget',
    timeOfDay: 'morning',
    tags: ['budget', 'nature', 'morning', 'peaceful'],
    isFeatured: true,
    likes: 312,
    stops: [
      {
        id: 'lalbagh-gardens',
        name: 'Lalbagh Botanical Garden',
        type: 'park',
        description: 'Historic botanical garden with stunning flora',
        estimatedCost: 30,
        duration: 90,
        address: 'Lalbagh Road, Bengaluru',
        coordinates: { lat: 12.9507, lng: 77.5848 },
        tips: 'Start early to beat the crowds',
        googleMapsUrl: 'https://maps.google.com/?q=Lalbagh+Botanical+Garden'
      },
      {
        id: 'vidyarthi-bhavan',
        name: 'Vidyarthi Bhavan',
        type: 'restaurant',
        description: 'Legendary South Indian breakfast spot',
        estimatedCost: 200,
        duration: 45,
        address: '32, Gandhi Bazaar, Basavanagudi',
        coordinates: { lat: 12.9434, lng: 77.5725 },
        tips: 'Their masala dosa is legendary - expect a queue!',
        googleMapsUrl: 'https://maps.google.com/?q=Vidyarthi+Bhavan'
      },
      {
        id: 'brahmin-coffee',
        name: 'Brahmin\'s Coffee Bar',
        type: 'cafe',
        description: 'Old-school South Indian coffee and snacks',
        estimatedCost: 100,
        duration: 30,
        address: 'Ranga Rao Road, Shankarapuram',
        coordinates: { lat: 12.9452, lng: 77.5698 },
        tips: 'Try the idli-vada combo with filter coffee',
        googleMapsUrl: 'https://maps.google.com/?q=Brahmins+Coffee+Bar'
      }
    ]
  },
  {
    id: 'ub-city-luxury-evening',
    title: 'UB City Luxury Experience',
    subtitle: 'The Upscale Date Night',
    heroImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    totalCost: 5000,
    duration: 240, // 4 hours
    area: 'UB City',
    vibe: 'luxury',
    timeOfDay: 'evening',
    tags: ['luxury', 'fine-dining', 'upscale', 'special-occasion'],
    isFeatured: false,
    likes: 98,
    stops: [
      {
        id: 'ub-city-walk',
        name: 'UB City Mall Walk',
        type: 'shopping',
        description: 'Luxury shopping at Bangalore\'s premium mall',
        estimatedCost: 0,
        duration: 45,
        address: '24, Vittal Mallya Road',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        tips: 'Window shopping is free and fun!',
        googleMapsUrl: 'https://maps.google.com/?q=UB+City+Bangalore'
      },
      {
        id: 'shiro-lounge',
        name: 'Shiro Lounge',
        type: 'bar',
        description: 'Upscale Asian lounge with stunning interiors',
        estimatedCost: 1500,
        duration: 60,
        address: 'UB City, Vittal Mallya Road',
        coordinates: { lat: 12.9718, lng: 77.5950 },
        tips: 'Their cocktails are art',
        googleMapsUrl: 'https://maps.google.com/?q=Shiro+UB+City'
      },
      {
        id: 'caperberry',
        name: 'Caperberry',
        type: 'restaurant',
        description: 'Mediterranean fine dining experience',
        estimatedCost: 3500,
        duration: 120,
        address: 'UB City, Level 1',
        coordinates: { lat: 12.9720, lng: 77.5952 },
        tips: 'Book the terrace table for city views',
        googleMapsUrl: 'https://maps.google.com/?q=Caperberry+UB+City'
      }
    ]
  },
  {
    id: 'whitefield-weekend-date',
    title: 'Whitefield Weekend Escape',
    subtitle: 'The Chill Whitefield Date',
    heroImage: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    totalCost: 1800,
    duration: 300, // 5 hours
    area: 'Whitefield',
    vibe: 'chill',
    timeOfDay: 'all-day',
    tags: ['weekend', 'relaxed', 'brunch', 'games'],
    isFeatured: false,
    likes: 145,
    stops: [
      {
        id: 'herbs-spices',
        name: 'Herbs & Spices',
        type: 'restaurant',
        description: 'Healthy organic brunch spot',
        estimatedCost: 600,
        duration: 60,
        address: 'ITPL Main Road, Whitefield',
        coordinates: { lat: 12.9698, lng: 77.7500 },
        tips: 'Their acai bowls are Instagram-worthy',
        googleMapsUrl: 'https://maps.google.com/?q=Herbs+Spices+Whitefield'
      },
      {
        id: 'phoenix-market',
        name: 'Phoenix Marketcity Walk',
        type: 'shopping',
        description: 'Explore the massive mall together',
        estimatedCost: 0,
        duration: 90,
        address: 'Whitefield Main Road',
        coordinates: { lat: 12.9972, lng: 77.6956 },
        tips: 'Check out the arcade on the top floor',
        googleMapsUrl: 'https://maps.google.com/?q=Phoenix+Marketcity+Whitefield'
      },
      {
        id: 'smaaash',
        name: 'Smaaash Gaming',
        type: 'activity',
        description: 'VR gaming and bowling fun',
        estimatedCost: 800,
        duration: 90,
        address: 'Phoenix Marketcity, Whitefield',
        coordinates: { lat: 12.9975, lng: 77.6960 },
        tips: 'Try the VR cricket simulator',
        googleMapsUrl: 'https://maps.google.com/?q=Smaaash+Phoenix+Whitefield'
      },
      {
        id: 'ice-cream-dessert',
        name: 'Baskin Robbins',
        type: 'dessert',
        description: 'Classic ice cream to end the day',
        estimatedCost: 400,
        duration: 30,
        address: 'Phoenix Marketcity',
        coordinates: { lat: 12.9970, lng: 77.6955 },
        tips: 'Gold Medal Ribbon is a classic',
        googleMapsUrl: 'https://maps.google.com/?q=Baskin+Robbins+Phoenix'
      }
    ]
  },
  {
    id: 'jayanagar-cultural-date',
    title: 'Jayanagar Cultural Evening',
    subtitle: 'The Heritage and Art Date',
    heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    totalCost: 800,
    duration: 210, // 3.5 hours
    area: 'Jayanagar',
    vibe: 'cultural',
    timeOfDay: 'evening',
    tags: ['cultural', 'heritage', 'art', 'traditional'],
    isFeatured: false,
    likes: 87,
    stops: [
      {
        id: 'ranga-shankara',
        name: 'Ranga Shankara Theatre',
        type: 'attraction',
        description: 'Catch a play at this iconic theatre',
        estimatedCost: 300,
        duration: 120,
        address: '36/2, 8th Cross, JP Nagar 2nd Phase',
        coordinates: { lat: 12.9116, lng: 77.5920 },
        tips: 'Book tickets online in advance',
        googleMapsUrl: 'https://maps.google.com/?q=Ranga+Shankara'
      },
      {
        id: 'mtr-jayanagar',
        name: 'MTR Restaurant',
        type: 'restaurant',
        description: 'Iconic South Indian dining since 1924',
        estimatedCost: 350,
        duration: 60,
        address: '14, Lalbagh Road, Jayanagar',
        coordinates: { lat: 12.9520, lng: 77.5800 },
        tips: 'Try their rava idli - they invented it!',
        googleMapsUrl: 'https://maps.google.com/?q=MTR+Jayanagar'
      },
      {
        id: 'cool-joint',
        name: 'Cool Joint Ice Cream',
        type: 'dessert',
        description: 'Old-school ice cream parlor',
        estimatedCost: 150,
        duration: 30,
        address: '4th Block, Jayanagar',
        coordinates: { lat: 12.9300, lng: 77.5820 },
        tips: 'Their khus khus is refreshing',
        googleMapsUrl: 'https://maps.google.com/?q=Cool+Joint+Jayanagar'
      }
    ]
  },
  {
    id: 'hsr-late-night',
    title: 'HSR Late Night Date',
    subtitle: 'The Night Owl\'s Perfect Date',
    heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    totalCost: 1600,
    duration: 180, // 3 hours
    area: 'HSR Layout',
    vibe: 'adventurous',
    timeOfDay: 'night',
    tags: ['late-night', 'drinks', 'live-music', 'trendy'],
    isFeatured: true,
    likes: 201,
    stops: [
      {
        id: 'social-hsr',
        name: 'Social HSR',
        type: 'bar',
        description: 'Trendy bar with great cocktails and vibe',
        estimatedCost: 800,
        duration: 90,
        address: '27th Main, HSR Layout',
        coordinates: { lat: 12.9116, lng: 77.6389 },
        tips: 'Their LIIT is strong - pace yourself!',
        googleMapsUrl: 'https://maps.google.com/?q=Social+HSR+Layout'
      },
      {
        id: 'midnight-chai',
        name: 'Chai Point',
        type: 'cafe',
        description: 'Late night chai and snacks',
        estimatedCost: 200,
        duration: 30,
        address: '27th Main, HSR Layout',
        coordinates: { lat: 12.9120, lng: 77.6385 },
        tips: 'Try the masala chai with bun maska',
        googleMapsUrl: 'https://maps.google.com/?q=Chai+Point+HSR'
      },
      {
        id: 'midnight-ice-cream',
        name: 'Naturals Ice Cream',
        type: 'dessert',
        description: 'Natural fruit ice creams',
        estimatedCost: 300,
        duration: 30,
        address: 'HSR Layout Sector 2',
        coordinates: { lat: 12.9118, lng: 77.6380 },
        tips: 'Tender coconut is their specialty',
        googleMapsUrl: 'https://maps.google.com/?q=Naturals+HSR'
      }
    ]
  }
];

// Helper to get featured date plans
export const getFeaturedDatePlans = (): DatePlan[] => {
  return mockDatePlans.filter(plan => plan.isFeatured);
};

// Helper to get date plans by area
export const getDatePlansByArea = (area: string): DatePlan[] => {
  return mockDatePlans.filter(plan => 
    plan.area.toLowerCase().includes(area.toLowerCase())
  );
};

// Helper to get date plans by vibe
export const getDatePlansByVibe = (vibe: DatePlan['vibe']): DatePlan[] => {
  return mockDatePlans.filter(plan => plan.vibe === vibe);
};

// Helper to get date plan by ID
export const getDatePlanById = (id: string): DatePlan | undefined => {
  return mockDatePlans.find(plan => plan.id === id);
};

// Get all unique areas
export const getAllAreas = (): string[] => {
  return [...new Set(mockDatePlans.map(plan => plan.area))];
};
