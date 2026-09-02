import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RemoteImage } from '../images/RemoteImage';
import { getDestinationImageQuery } from '../../utils/imageQueries';

export const DestinationCard = ({
  destination,
  className = '',
  showTags = true
}) => {
  if (!destination) return null;

  const {
    id,
    name,
    country,
    region,
    category,
    shortDescription,
    rating = 4.8,
    reviewsCount = 1200,
    estimatedBudget,
    duration,
    featured,
    tags = []
  } = destination;

  // Category badge color mapping
  const categoryVariantMap = {
    Beach: 'accent',
    City: 'brand',
    Culture: 'default',
    Adventure: 'dark',
    Nature: 'success',
    Luxury: 'accent',
    Food: 'brand'
  };

  const imageQuery = getDestinationImageQuery(destination);
  const titleId = `dest-title-${id}`;

  return (
    <Card
      as="article"
      variant="interactive"
      aria-labelledby={titleId}
      className={`flex flex-col h-full group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-1 transition-all duration-250 ease-smooth ${className}`}
    >
      {/* Remote Image Container with Dynamic External Photo */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
        <RemoteImage
          query={imageQuery}
          alt={`Landscape photograph of ${name}, ${country}`}
          fallbackTitle={name}
          fallbackCategory={category}
          aspectRatio="aspect-[16/10]"
          showAttribution={true}
        />

        {/* Top Left Category & Featured Badges */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
          <Badge
            variant={categoryVariantMap[category] || 'default'}
            size="sm"
            className="shadow-sm backdrop-blur-md bg-white/90 font-semibold"
          >
            {category}
          </Badge>
          {featured && (
            <Badge
              variant="dark"
              size="sm"
              icon={Sparkles}
              className="bg-slate-950/80 text-amber-300 border-white/10 shadow-sm"
            >
              Featured
            </Badge>
          )}
        </div>

        {/* Top Right Rating Pill */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md text-white text-xs font-bold border border-white/15 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      {/* Card Header & Content */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="flex items-center gap-1 font-semibold text-brand-600">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {country} · {region}
          </span>
          <span className="text-slate-400 text-[11px]">
            {reviewsCount.toLocaleString()} reviews
          </span>
        </div>

        <Link
          to={`/destinations/${id}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
        >
          <CardTitle id={titleId} as="h3" className="text-xl group-hover:text-brand-600 transition-colors duration-150">
            {name}
          </CardTitle>
        </Link>

        <CardDescription className="line-clamp-2 mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500">
          {shortDescription}
        </CardDescription>
      </CardHeader>

      {/* Tags Row */}
      {showTags && tags && tags.length > 0 && (
        <div className="px-5 sm:px-6 py-1 flex flex-wrap gap-1.5" aria-label="Destination tags">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata Pill Box */}
      <CardContent className="pt-3 pb-3">
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:bg-slate-100/70 transition-colors">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
              Est. Budget
            </span>
            <span className="font-bold text-slate-900 text-xs">
              {estimatedBudget || 'Flexible'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
              Duration
            </span>
            <span className="font-semibold text-slate-700 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {duration || '3-5 Days'}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Card Footer with CTA */}
      <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-medium text-slate-400">
          Guide ready
        </span>

        <Link
          to={`/destinations/${id}`}
          aria-label={`Explore travel guide and itineraries for ${name}, ${country}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
        >
          <Button
            variant="ghost"
            size="sm"
            iconRight={ArrowRight}
            className="text-brand-600 hover:text-brand-700 font-semibold p-0 px-2 pointer-events-none group-hover:translate-x-0.5 transition-transform"
            tabIndex={-1}
          >
            Explore Guide
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
