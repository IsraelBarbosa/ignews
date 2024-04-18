import Image from 'next/image';
import styles from './styles.module.scss';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" width={110} height={31} alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            Home
          </ActiveLink>
          <ActiveLink href="/post" activeClassName={styles.active}>
            Posts
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
