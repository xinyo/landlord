import React from 'react';
import { Box, Container, HStack, Text, Link } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <Box as="footer" mt={8} py={4} bg="transparent">
      <Container maxW="container.xl">
        <HStack justify="center" gap={4}>
          <Text color="gray.500" fontSize="sm">{t('footer.credit', { year })}</Text>
          <Link color="gray.500" fontSize="sm" href="https://github.com/xinyo/landlord" target="_blank" rel="noopener noreferrer">
            {t('footer.github')}
          </Link>
        </HStack>
      </Container>
    </Box>
  );
};

export default Footer;
