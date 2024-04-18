import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';

interface ISessionActiveSubscription extends Session {
  activeSubscription: {
    data: {
      id: string;
      price_id: string;
      status: string;
      userId: {
        '@ref': {
          id: string;
        };
      };
    };
  };
}

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if ((session as ISessionActiveSubscription).activeSubscription) {
      router.push('/post');
      return;
    }

    try {
      const response = await api.post('/subscribe');
      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      if (!stripe) throw new Error('Stripe not found');

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
