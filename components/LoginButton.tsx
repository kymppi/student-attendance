import { Button } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';

type Props = {};

const LoginButton = (props: Props) => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <Button leftIcon={<IconBrandGoogle />} onClick={() => signOut()}>
        Logout
      </Button>
    );
  }

  return (
    <Button leftIcon={<IconBrandGoogle />} onClick={() => signIn('google')}>
      Login with Google
    </Button>
  );
};

export default LoginButton;
