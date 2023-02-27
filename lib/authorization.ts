import type { Value } from '@cerbos/core';
import { GRPC } from '@cerbos/grpc';
import prisma from '@lib/prisma-client';
import { User } from '@prisma/client';

const cerbos = new GRPC(process.env.CERBOS_GRPC || 'localhost:3593', {
  tls: false,
});
const SHOW_REQUEST_LOG = process.env.SHOW_CERBOS_REQS || false;

export const authorize = async (
  principalId: string,
  action: string,
  resource: string,
  resourceAtrr: Record<string, Value> = {}
): Promise<{ authorized: boolean; user: User }> => {
  const user = await prisma.user.findUnique({
    where: {
      id: principalId,
    },
  });

  if (!user) throw new Error('User not found!');

  const cerbosObj = {
    resource: {
      kind: resource,
      policyVersion: 'default',
      id: resourceAtrr.id + '' || 'new',
      attributes: resourceAtrr,
    },
    principal: {
      id: principalId + '' || '0',
      policyVersion: 'default',
      roles: [user.role || 'unknown'],
      attributes: user,
    },
    actions: [action],
  };

  SHOW_REQUEST_LOG &&
    console.log('cerbosObject \n', JSON.stringify(cerbosObj, null, 4));

  const check = await cerbos.checkResource(cerbosObj as any);

  const isAuthorized = check.isAllowed(action);

  return { authorized: isAuthorized || false, user };
};
