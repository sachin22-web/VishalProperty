-- Seed properties from demoProperties
INSERT INTO public.properties (
  title,
  description,
  price,
  location,
  sector,
  area,
  property_type,
  status,
  images
) VALUES
(
  'Sunset Heights 3BHK Apartment',
  'Premium 3BHK with balcony view and covered parking.',
  6500000,
  'Sector 3',
  '3',
  1650,
  'flat',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2c5a?w=1200'
  ]
),
(
  'Greenview Villa 4BHK',
  'Independent villa with garden and servant room.',
  12500000,
  'Sector 1',
  '1',
  2800,
  'flat',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1560185008-b033106af2c0?w=1200',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200'
  ]
),
(
  'City Center Office Space',
  'Fully furnished 900 sq.ft office near bus stand.',
  3200000,
  'City Center',
  NULL,
  900,
  'commercial',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1551292831-023188e78222?w=1200',
    'https://images.unsplash.com/photo-1557683304-673a23048d34?w=1200',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200'
  ]
),
(
  'Bright 2BHK for Rent',
  'Newly renovated, modular kitchen, near university.',
  18000,
  'Vikaspuri',
  NULL,
  980,
  'rental',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?w=1200',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200'
  ]
),
(
  'Corner Residential Plot 200 sq yd',
  'East-facing corner plot, wide road, clear title.',
  5200000,
  'Sector 4',
  '4',
  1800,
  'plot',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
  ]
),
(
  'Luxury Penthouse with Terrace',
  'Private deck, smart lighting, and city skyline view.',
  21500000,
  'Premium Enclave',
  NULL,
  3400,
  'flat',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200',
    'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200'
  ]
),
(
  '3 BHK Luxury Flat in Suncity Rohtak',
  'Premium 3BHK apartment with modern amenities in Suncity Heights.',
  8500000,
  'Suncity Heights',
  'Suncity Heights',
  1650,
  'flat',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200'
  ]
),
(
  '2 BHK Rental Apartment Sector 7',
  'Semi-furnished 2BHK apartment with parking and power backup.',
  25000,
  'Sector 7',
  '7',
  1100,
  'rental',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?w=1200'
  ]
),
(
  'Plot 500 sqft in Rohtak City Center',
  'Gated community plot with clear title and good connectivity.',
  3200000,
  'City Center',
  NULL,
  500,
  'plot',
  'pending',
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
  ]
),
(
  'Commercial Space 2000 sqft',
  'Unfurnished commercial space with lift and parking.',
  80000,
  'Main Road',
  NULL,
  2400,
  'commercial',
  'available',
  ARRAY[
    'https://images.unsplash.com/photo-1551292831-023188e78222?w=1200',
    'https://images.unsplash.com/photo-1557683304-673a23048d34?w=1200'
  ]
),
(
  'Villa with Garden - Rohtak Outskirts',
  'Spacious 4BHK villa with garden, pool and modern amenities.',
  15000000,
  'Rohtak Outskirts',
  NULL,
  3200,
  'flat',
  'pending',
  ARRAY[
    'https://images.unsplash.com/photo-1560185008-b033106af2c0?w=1200',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200'
  ]
);

-- Seed leads
INSERT INTO public.leads (
  name,
  email,
  phone,
  requirement,
  budget_min,
  budget_max,
  preferred_localities,
  property_type,
  bedrooms,
  timeline,
  source,
  status,
  notes
) VALUES
(
  'Amit Verma',
  'amit@gmail.com',
  '9876123456',
  'buy',
  5000000,
  10000000,
  ARRAY['Suncity Heights', 'Sector 7'],
  ARRAY['flat', 'villa'],
  ARRAY[2, 3],
  '1-3 months',
  'Website',
  'qualified',
  'Serious buyer, ready for site visit'
),
(
  'Neha Gupta',
  'neha@yahoo.com',
  '9876123457',
  'rent',
  20000,
  40000,
  ARRAY['Sector 7', 'City Center'],
  ARRAY['flat'],
  ARRAY[1, 2],
  'Immediate',
  'WhatsApp',
  'contacted',
  'Looking for furnished apartment'
),
(
  'Rajendra Singh',
  'rajendra@business.com',
  '9876123458',
  'buy',
  15000000,
  25000000,
  ARRAY['Rohtak Outskirts'],
  ARRAY['villa', 'plot'],
  ARRAY[3, 4],
  'Immediate',
  'Referral',
  'site-visit',
  'High-value lead, schedule property visit ASAP'
),
(
  'Priya Sharma',
  'priya.sharma@gmail.com',
  '9876123459',
  'rent',
  30000,
  50000,
  ARRAY['Suncity Heights', 'Sector 7'],
  ARRAY['flat'],
  ARRAY[2],
  '6+ months',
  'Google Ads',
  'new',
  'Initial inquiry, needs follow-up'
),
(
  'Vikram Patel',
  'vikram.patel@industry.com',
  '9876123460',
  'buy',
  3000000,
  5000000,
  ARRAY['City Center', 'Main Road'],
  ARRAY['plot'],
  NULL,
  '1-3 months',
  'Website',
  'offer',
  'Negotiating price, expecting counter offer'
);

-- Seed agents
INSERT INTO public.agents (
  name,
  email,
  phone,
  areas,
  languages,
  kpi_leads,
  kpi_conversions,
  kyc,
  active_assignments,
  availability
) VALUES
(
  'Rajesh Kumar',
  'rajesh@vishalproperties.com',
  '9876543210',
  ARRAY['Suncity Heights', 'Sector 7', 'City Center'],
  ARRAY['Hindi', 'English', 'Punjabi'],
  45,
  8,
  TRUE,
  12,
  'Available'
),
(
  'Priya Singh',
  'priya@vishalproperties.com',
  '9876543211',
  ARRAY['Rohtak Outskirts', 'Sector 7'],
  ARRAY['Hindi', 'English'],
  38,
  6,
  TRUE,
  10,
  'Busy'
),
(
  'Vikram Patel',
  'vikram@vishalproperties.com',
  '9876543212',
  ARRAY['City Center', 'Main Road', 'Suncity Heights'],
  ARRAY['Hindi', 'English', 'Gujarati'],
  52,
  10,
  TRUE,
  15,
  'Available'
);
