import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps): JSX.Element {
  return <div>{children}</div>;
}

export default Layout;
