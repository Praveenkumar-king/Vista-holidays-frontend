import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Eye 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RemoteImage } from '../images/RemoteImage';
import { getFamousPlaceImageQuery } from '../../utils/imageQueries';

export const FamousPlaceCard = ({
  place,
  onSelectPlace,
  showDestinationLink = false,
  className = ''
}) => {
  if (!place) return null;

  const {
    id,
    destinationId,
    name,
    category,
    location,
    shortDescription,
    estimatedVisitTime,
    featured
  } = place;

  const imageQuery = getFamousPlaceImageQuery(place);
  const titleId = `place-title-${id}`;

  return (
    <Card
      as="article"
      variant="interactive"
      aria-labelledby={titleId}
      className={`flex flex-col h-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-1 transition-all duration-250 ease-smooth group ${className}`}
    >
      {/* Visual / Landmark Media Container with Remote Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
        <RemoteImage
          query={imageQuery}
          alt={`Photograph of ${name} landmark in ${location}`}
          fallbackTitle={name}
          fallbackCategory={category}
          aspectRatio="aspect-[16/10]"
          showAttribution={true}
        />

        {/* Category & Featured Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
          <Badge
            variant="glass"
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
              Must-Visit
            </Badge>
          )}
        </div>

        {/* Visit Duration Badge */}
        {estimatedVisitTime && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15 shadow-sm">
              <Clock className="w-3 h-3 text-sky-300" />
              <span>{estimatedVisitTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span className="font-medium text-slate-700 truncate">{location}</span>
        </div>

        <CardTitle id={titleId} as="h3" className="text-lg group-hover:text-brand-600 transition-colors duration-150">
          {name}
        </CardTitle>

        <CardDescription className="line-clamp-2 mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500">
          {shortDescription}
        </CardDescription>
      </CardHeader>

      {/* Card Footer with Details Trigger & Destination link */}
      <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        {showDestinationLink && destinationId ? (
          <Link
            to={`/destinations/${destinationId}`}
            aria-label={`Explore city guide for ${location}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md group-hover:translate-x-0.5 transition-transform"
          >
            <span>Explore City</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            Verified Landmark
          </span>
        )}

        {onSelectPlace ? (
          <Button
            variant="secondary"
            size="xs"
            onClick={() => onSelectPlace(place)}
            aria-label={`View detailed overview and highlights for ${name}`}
            className="font-medium hover:border-slate-300"
          >
            Details
          </Button>
        ) : (
          showDestinationLink && (
            <Link
              to={`/destinations/${destinationId}`}
              aria-label={`View guide for ${name}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
            >
              <Button
                variant="ghost"
                size="xs"
                iconRight={ArrowRight}
                className="text-brand-600 font-semibold p-0 px-2 pointer-events-none"
                tabIndex={-1}
              >
                View
              </Button>
            </Link>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default FamousPlaceCard;
