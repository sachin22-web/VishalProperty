import { Link } from 'react-router-dom';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, logout } = useAuthApi();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Vishal Properties
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/properties" className="text-gray-600 hover:text-primary transition">
            Properties
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-primary transition">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-primary transition">
            Contact
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user.name}</span>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                <Button size="sm" variant="outline">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button size="sm" variant="outline">
                  Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
