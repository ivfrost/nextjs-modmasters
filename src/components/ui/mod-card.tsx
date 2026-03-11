import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ModCardProps } from '@/types/schemas';
import { getTimeSince } from '@/utils/time';
import CardImage from '../card-image';
import StatsOverlay from '../stats-overlay';

export function ModCard(props: ModCardProps) {
  const {
    title,
    content,
    summary,
    category,
    updatedAt,
    imageUrl,
    downloads,
    comments,
    href,
  } = props;

  return (
    <Card className="flex flex-col lg:flex-row gap-4 lg:px-6 px-4">
      <div className="relative lg:aspect-square rounded-lg shadow-sm shrink-0 overflow-hidden lg:-mx-2 -mt-2 lg:mr-0 lg:-mb-2 h-26 lg:h-auto">
        <CardImage imageUrl={imageUrl} />
        <StatsOverlay comments={comments} downloads={downloads} />
      </div>
      <div className="flex flex-col space-y-4 w-full">
        <CardHeader className="flex justify-between px-0 ">
          {(href && (
            <Link href={href}>
              <CardTitle>{title}</CardTitle>
            </Link>
          )) || <CardTitle>{title}</CardTitle>}
          <div className="flex gap-2 items-center text-xs text-muted-foreground font-medium">
            <div className="flex items-center text-xs text-muted-foreground font-medium">
              <span className="-mb-0.5 whitespace-nowrap">
                {getTimeSince(updatedAt)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm lg:text-base lg:gap-4 p-0">
          <CardDescription className="line-clamp-3 text-xs lg:h-14 md:text-sm text-muted-foreground">
            {summary || content || 'No description available.'}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between mt-auto items-center px-0 -mb-2">
          {category && <Badge variant="secondary">{category}</Badge>}
          {href && (
            <Link
              href={href}
              className="text-xs md:text-sm font-medium text-blue-500 underline shrink-0 flex items-center"
            >
              Learn More
              <ArrowRight size={14} className="ml-1" />
            </Link>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
