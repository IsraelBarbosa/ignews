import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  activeClassName: string;
  href: string;
}

export function ActiveLink({
  children,
  activeClassName,
  href,
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  const className = asPath === href ? activeClassName : '';

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
