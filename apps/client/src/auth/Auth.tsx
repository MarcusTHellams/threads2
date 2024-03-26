import { useColorMode, Button } from '@chakra-ui/react';

export const Auth = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div>
      <header>
        <p>Auth</p>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </header>
    </div>
  );
};
