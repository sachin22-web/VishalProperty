-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'pending');
CREATE TYPE public.property_type AS ENUM ('flat', 'plot', 'commercial', 'rental');
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  location TEXT NOT NULL,
  sector TEXT,
  area INTEGER NOT NULL,
  area_unit TEXT DEFAULT 'sq.ft',
  property_type public.property_type NOT NULL,
  status public.property_status DEFAULT 'available',
  images TEXT[],
  features TEXT[],
  created_by UUID,
  brochure_url TEXT,
  map_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_location ON public.properties(location);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_enquiries_property_id ON public.enquiries(property_id);

-- Create property_submissions table
CREATE TABLE public.property_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  location TEXT NOT NULL,
  sector TEXT,
  area INTEGER NOT NULL,
  area_unit TEXT DEFAULT 'sq.ft',
  property_type public.property_type NOT NULL,
  images TEXT[],
  features TEXT[],
  status public.submission_status DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_submissions_user_id ON public.property_submissions(user_id);
CREATE INDEX idx_submissions_status ON public.property_submissions(status);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  requirement TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_localities TEXT[],
  property_type TEXT[],
  bedrooms INTEGER[],
  timeline TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  assigned_agent UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX idx_leads_status ON public.leads(status);

-- Create agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  areas TEXT[],
  languages TEXT[],
  kpi_leads INTEGER DEFAULT 0,
  kpi_conversions INTEGER DEFAULT 0,
  kyc BOOLEAN DEFAULT FALSE,
  active_assignments INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'Available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Properties - public read, admin write
CREATE POLICY "Properties are publicly visible" ON public.properties
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert properties" ON public.properties
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can update properties" ON public.properties
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );

-- Enquiries - public insert, admin read
CREATE POLICY "Anyone can create enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read enquiries" ON public.enquiries
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );

-- Property Submissions
CREATE POLICY "Users can create own submissions" ON public.property_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON public.property_submissions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- Leads - admin only
CREATE POLICY "Only admins can access leads" ON public.leads
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage leads" ON public.leads
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );

-- Agents
CREATE POLICY "Agents are viewable by authenticated users" ON public.agents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function for checking roles
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID,
  _role app_role
) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE SQL STABLE;
