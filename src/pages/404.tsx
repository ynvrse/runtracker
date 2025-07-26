import { NavLink } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="bg-background text-foreground flex flex-grow items-center justify-center">
      <div className="space-y-4">
        <h2 className="mb-4 text-8xl">404</h2>
        <h1 className="text-3xl font-semibold">Oops! Page not found</h1>
        <p className="text-muted-foreground text-sm">
          We are sorry, but the page you requested was not found
        </p>
        <NavLink to="/" className={buttonVariants()}>
          Back to Home
        </NavLink>
      </div>
    </div>
  );
}
