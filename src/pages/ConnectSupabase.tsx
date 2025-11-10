import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConnectSupabase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Page Moved</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            This page is no longer available. The application now uses MongoDB instead of Supabase.
          </p>
          <div className="space-y-2">
            <Link to="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
            <Link to="/properties">
              <Button variant="outline" className="w-full">View Properties</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
