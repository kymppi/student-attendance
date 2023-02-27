import type { Value } from '@cerbos/core';
import { User } from '@prisma/client';
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
): Promise<Error | { session: Session; user: User }> => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).send({ error: 'Unauthorized' });

    return new Error('Unauthorized');
  }

  const { authorized, user } = await authorize(
    session.userId,
    action,
    resource,
    resourceData(session)
  );

  if (!authorized) {
    res.status(403).send({ error: 'Invalid permissions' });
    console.log(
      `User '${session.userId}' tried to access ${req.url} without ${action} permission.`
    );

    return new Error('Invalid permissions');
  }

  return { session: session, user };
};
