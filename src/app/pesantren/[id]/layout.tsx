import { ReactNode } from 'react';

interface PesantrenLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default function PesantrenLayout({ children }: PesantrenLayoutProps) {
  return <>{children}</>;
}