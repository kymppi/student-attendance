import type { Value } from '@cerbos/core';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { authorize } from './authorization';

export const protect = async (
  req: NextApiRequest,
  res: NextApiResponse,
  action: string,
  resource: string,
  resourceData: (_session: Session) => Record<string, Value>
) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).send({ error: 'Unauthorized' });

    return false;
  }

  const { authorized, user } = await authorize(
    session.userId,
    action,
    resource,
    resourceData(session)
  );

  if (!authorized) {
    res.status(403).send({ error: 'Invalid permissions' });

    return false;
  }

  return { session: session, user };
};