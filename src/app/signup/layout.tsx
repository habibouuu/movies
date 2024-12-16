// PROJECT IMPORTS
import MinimalLayout from 'layout/MinimalLayout';

// ==============================|| DASHBOARD LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MinimalLayout>{children}</MinimalLayout>;
}
