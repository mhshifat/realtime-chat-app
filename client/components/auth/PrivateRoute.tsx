import Router from 'next/router';
import { Children, ReactElement, useEffect } from 'react';
import { ROUTE_PATHS } from '../../constants';
import { useAuth } from '../../providers/Auth';
import { Loader } from '../common';

export interface PrivateRouteProps {
  children: ReactElement | ReactElement[];
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, processing } = useAuth();

  useEffect(() => {
    if (processing) return;
    if (!user?._id) Router.push(ROUTE_PATHS.LOGIN);
  }, [processing, user]);

  if (processing) return <Loader fixed />;
  if (!user) return <Loader fixed />;
  return (
    <>
      {children}
    </>
  );
}