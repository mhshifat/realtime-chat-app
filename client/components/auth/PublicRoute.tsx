import Router from 'next/router';
import { Children, ReactElement, useEffect } from 'react';
import { ROUTE_PATHS } from '../../constants';
import { useAuth } from '../../providers/Auth';
import { Loader } from '../common';

export interface PublicRouteProps {
  children: ReactElement | ReactElement[];
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { user, processing } = useAuth();

  useEffect(() => {
    if (processing) return;
    if (user?._id) Router.push(ROUTE_PATHS.DASHBOARD);
  }, [processing, user]);

  if (processing) return <Loader fixed />;
  if (user) return <Loader fixed />;
  return (
    <>
      {children}
    </>
  );
}