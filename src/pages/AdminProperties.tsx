import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoProperties } from '@/data/demoProperties';
import { toast } from 'sonner';

export default function AdminProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoadingProperties(true);
      const response = await api.getAdminProperties();
      setProperties(response.data);
    } catch (error: any) {
      toast.error('You need to be logged in as admin');
      navigate('/admin/login');
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const handleSeedData = async () => {
    try {
      for (const prop of demoProperties) {
        await api.createProperty({
          title: prop.title,
          slug: prop.title.toLowerCase().replace(/\s+/g, '-'),
          price: prop.price,
          propertyType: prop.type,
          location: prop.location,
          city: prop.city,
          area: prop.area,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          description: prop.description,
          images: prop.images,
          ownerContact: '9876543210',
          features: [],
          status: 'active'
        });
      }
      toast.success('Demo data seeded successfully');
      checkAuth();
    } catch (error: any) {
      toast.error(error.message || 'Failed to seed data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
          <CardDescription>
            You have {properties.length} properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => navigate('/admin/properties')}>
            Go to Property Management
          </Button>
          
          {properties.length === 0 && (
            <Button onClick={handleSeedData} variant="outline">
              Seed Demo Data
            </Button>
          )}

          {isLoadingProperties && <p>Loading properties...</p>}

          {properties.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold">Recent Properties:</h3>
              <ul className="space-y-1">
                {properties.slice(0, 5).map((prop) => (
                  <li key={prop._id} className="text-sm text-gray-600">
                    • {prop.title} - ₹{prop.price.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
