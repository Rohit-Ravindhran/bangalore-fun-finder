-- =============================================
-- Migration 004: New Features Schema
-- Date Planner, Outing Planner, Food Explorer,
-- Meetups, City Network, Jobs, Ride Deals
-- =============================================

-- =============================================
-- 1. DATE PACKAGES
-- =============================================
CREATE TABLE IF NOT EXISTS public.date_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    area TEXT,
    description TEXT,
    estimated_cost INTEGER,
    duration_minutes INTEGER,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.date_packages IS 'Curated date planning packages with multiple stops';

CREATE INDEX IF NOT EXISTS idx_date_packages_area ON public.date_packages(area);
CREATE INDEX IF NOT EXISTS idx_date_packages_created_at ON public.date_packages(created_at DESC);

-- =============================================
-- 2. OUTING PACKAGES
-- =============================================
CREATE TABLE IF NOT EXISTS public.outing_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    area TEXT,
    description TEXT,
    duration_minutes INTEGER,
    estimated_cost INTEGER,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.outing_packages IS 'Curated outing packages for friends, family, solo trips';

CREATE INDEX IF NOT EXISTS idx_outing_packages_area ON public.outing_packages(area);
CREATE INDEX IF NOT EXISTS idx_outing_packages_category ON public.outing_packages(category);
CREATE INDEX IF NOT EXISTS idx_outing_packages_created_at ON public.outing_packages(created_at DESC);

-- =============================================
-- 3. PACKAGE STOPS (Shared for date & outing packages)
-- =============================================
CREATE TYPE package_type_enum AS ENUM ('date', 'outing');

CREATE TABLE IF NOT EXISTS public.package_stops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    package_id UUID NOT NULL,
    package_type package_type_enum NOT NULL,
    stop_order INTEGER NOT NULL,
    place_name TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure stop_order is unique per package
    UNIQUE(package_id, package_type, stop_order)
);

COMMENT ON TABLE public.package_stops IS 'Normalized stops for date and outing packages';
COMMENT ON COLUMN public.package_stops.package_type IS 'date or outing - determines which parent table';
COMMENT ON COLUMN public.package_stops.stop_order IS 'Order of stop in the itinerary (1, 2, 3...)';

CREATE INDEX IF NOT EXISTS idx_package_stops_package ON public.package_stops(package_id, package_type);
CREATE INDEX IF NOT EXISTS idx_package_stops_order ON public.package_stops(package_id, stop_order);

-- =============================================
-- 4. FOOD PLACES (Food Explorer)
-- =============================================
CREATE TABLE IF NOT EXISTS public.food_places (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    area TEXT,
    category TEXT,
    rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
    price_range TEXT CHECK (price_range IN ('₹', '₹₹', '₹₹₹', '₹₹₹₹')),
    description TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    image TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.food_places IS 'Food places for the Food Explorer feature';
COMMENT ON COLUMN public.food_places.tags IS 'Array of tags like street food, late night, budget, etc.';

CREATE INDEX IF NOT EXISTS idx_food_places_area ON public.food_places(area);
CREATE INDEX IF NOT EXISTS idx_food_places_category ON public.food_places(category);
CREATE INDEX IF NOT EXISTS idx_food_places_rating ON public.food_places(rating DESC);
CREATE INDEX IF NOT EXISTS idx_food_places_tags ON public.food_places USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_food_places_created_at ON public.food_places(created_at DESC);

-- =============================================
-- 5. MEETUPS
-- =============================================
CREATE TABLE IF NOT EXISTS public.meetups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    host_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    max_people INTEGER,
    category TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.meetups IS 'Community meetups and events';

CREATE INDEX IF NOT EXISTS idx_meetups_date_time ON public.meetups(date_time);
CREATE INDEX IF NOT EXISTS idx_meetups_host ON public.meetups(host_user_id);
CREATE INDEX IF NOT EXISTS idx_meetups_category ON public.meetups(category);
CREATE INDEX IF NOT EXISTS idx_meetups_location ON public.meetups(location);

-- =============================================
-- 6. MEETUP PARTICIPANTS
-- =============================================
CREATE TYPE participant_status_enum AS ENUM ('joined', 'pending', 'cancelled');

CREATE TABLE IF NOT EXISTS public.meetup_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meetup_id UUID NOT NULL REFERENCES public.meetups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status participant_status_enum DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- One participation record per user per meetup
    UNIQUE(meetup_id, user_id)
);

COMMENT ON TABLE public.meetup_participants IS 'Tracks user participation in meetups';

CREATE INDEX IF NOT EXISTS idx_meetup_participants_meetup ON public.meetup_participants(meetup_id);
CREATE INDEX IF NOT EXISTS idx_meetup_participants_user ON public.meetup_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_meetup_participants_status ON public.meetup_participants(status);

-- =============================================
-- 7. CONNECTIONS (City Network)
-- =============================================
CREATE TYPE connection_status_enum AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE IF NOT EXISTS public.connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status connection_status_enum DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Prevent duplicate connection requests
    UNIQUE(sender_id, receiver_id),
    -- Prevent self-connections
    CHECK (sender_id != receiver_id)
);

COMMENT ON TABLE public.connections IS 'Social connections between users in the City Network';

CREATE INDEX IF NOT EXISTS idx_connections_sender ON public.connections(sender_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON public.connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

-- =============================================
-- 8. JOBS
-- =============================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    salary TEXT,
    location TEXT,
    description TEXT,
    contact TEXT,
    type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.jobs IS 'Job listings for the community';

CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- =============================================
-- 9. RIDE ROUTES (Ride Deals)
-- =============================================
CREATE TABLE IF NOT EXISTS public.ride_routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    provider TEXT NOT NULL,
    average_price INTEGER,
    deep_link TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.ride_routes IS 'Ride price comparisons and deep links';

CREATE INDEX IF NOT EXISTS idx_ride_routes_source ON public.ride_routes(source);
CREATE INDEX IF NOT EXISTS idx_ride_routes_destination ON public.ride_routes(destination);
CREATE INDEX IF NOT EXISTS idx_ride_routes_provider ON public.ride_routes(provider);
CREATE INDEX IF NOT EXISTS idx_ride_routes_route ON public.ride_routes(source, destination);

-- =============================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all new tables
ALTER TABLE public.date_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_routes ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (anyone can view)
CREATE POLICY "Public read access for date_packages" ON public.date_packages
    FOR SELECT USING (true);

CREATE POLICY "Public read access for outing_packages" ON public.outing_packages
    FOR SELECT USING (true);

CREATE POLICY "Public read access for package_stops" ON public.package_stops
    FOR SELECT USING (true);

CREATE POLICY "Public read access for food_places" ON public.food_places
    FOR SELECT USING (true);

CREATE POLICY "Public read access for meetups" ON public.meetups
    FOR SELECT USING (true);

CREATE POLICY "Public read access for jobs" ON public.jobs
    FOR SELECT USING (true);

CREATE POLICY "Public read access for ride_routes" ON public.ride_routes
    FOR SELECT USING (true);

-- AUTHENTICATED USER policies for meetup_participants
CREATE POLICY "Users can view meetup participants" ON public.meetup_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join meetups" ON public.meetup_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation" ON public.meetup_participants
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel own participation" ON public.meetup_participants
    FOR DELETE USING (auth.uid() = user_id);

-- AUTHENTICATED USER policies for connections
CREATE POLICY "Users can view their connections" ON public.connections
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send connection requests" ON public.connections
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received connection requests" ON public.connections
    FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their connections" ON public.connections
    FOR DELETE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- MEETUP HOST policies
CREATE POLICY "Hosts can create meetups" ON public.meetups
    FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Hosts can update their meetups" ON public.meetups
    FOR UPDATE USING (auth.uid() = host_user_id);

CREATE POLICY "Hosts can delete their meetups" ON public.meetups
    FOR DELETE USING (auth.uid() = host_user_id);

-- =============================================
-- 11. HELPER FUNCTIONS
-- =============================================

-- Function to get participant count for a meetup
CREATE OR REPLACE FUNCTION get_meetup_participant_count(meetup_uuid UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER 
    FROM public.meetup_participants 
    WHERE meetup_id = meetup_uuid AND status = 'joined';
$$ LANGUAGE SQL STABLE;

-- Function to check if meetup is full
CREATE OR REPLACE FUNCTION is_meetup_full(meetup_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT COALESCE(
        (SELECT get_meetup_participant_count(meetup_uuid) >= m.max_people 
         FROM public.meetups m 
         WHERE m.id = meetup_uuid AND m.max_people IS NOT NULL),
        false
    );
$$ LANGUAGE SQL STABLE;

-- Function to get mutual connections count
CREATE OR REPLACE FUNCTION get_mutual_connections_count(user1 UUID, user2 UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER FROM (
        SELECT receiver_id FROM public.connections WHERE sender_id = user1 AND status = 'accepted'
        UNION
        SELECT sender_id FROM public.connections WHERE receiver_id = user1 AND status = 'accepted'
    ) AS user1_friends
    INNER JOIN (
        SELECT receiver_id FROM public.connections WHERE sender_id = user2 AND status = 'accepted'
        UNION
        SELECT sender_id FROM public.connections WHERE receiver_id = user2 AND status = 'accepted'
    ) AS user2_friends
    ON user1_friends.receiver_id = user2_friends.receiver_id;
$$ LANGUAGE SQL STABLE;
