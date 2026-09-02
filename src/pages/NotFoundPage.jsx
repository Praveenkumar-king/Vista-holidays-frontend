import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Container } from '../components/layout';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <Container size="sm">
        <Card variant="default" className="text-center p-8 sm:p-12 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-6 border border-brand-100">
            <Compass className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            404 Error
          </span>

          <CardTitle as="h1" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Destination Not Found
          </CardTitle>

          <CardDescription className="text-slate-500 max-w-sm mx-auto mb-8 text-sm sm:text-base">
            It looks like this journey route doesn’t exist or has been relocated to another territory.
          </CardDescription>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/">
              <Button variant="primary" size="md" iconLeft={Home} className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Link to="/destinations">
              <Button variant="secondary" size="md" iconLeft={Compass} className="w-full sm:w-auto">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default NotFoundPage;
