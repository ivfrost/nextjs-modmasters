import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function ButtonBack(props: { href: string }) {
  const { href } = props;
  return (
    <Link href={href}>
      <Button variant="outline">
        <ArrowLeft className='h-4 w-4 mr-2"' />
        <span>Back</span>
      </Button>
    </Link>
  );
}
