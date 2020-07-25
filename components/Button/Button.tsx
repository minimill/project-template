import React from 'react';
import { StyledButton } from './Button.style';
import Link, { LinkProps } from 'next/link';
export { ButtonGroup } from './Button.style';

interface ButtonProps
  extends Partial<LinkProps>,
    React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  href?: string;
}

const Button = ({ children, href, onClick }: ButtonProps): JSX.Element => {
  const btn = <StyledButton onClick={onClick}>{children}</StyledButton>;

  if (!href) {
    return btn;
  } else {
    return (
      <Link href={href} passHref>
        {btn}
      </Link>
    );
  }
};

export default Button;
