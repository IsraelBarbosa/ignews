import { createClient } from '@/services/prismicio';
import * as prismicH from '@prismicio/helpers';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import styles from '../uid.module.scss';
import { Session } from 'next-auth';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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

type PostPreview = {
  uid: string;
  first_publication_date: string;
  last_publication_date: string;
  lang: string;
  data: {
    title: string;
    content: string;
  };
};

type Params = {
  uid: string;
};

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

export default function PostPreview({ post }: { post: PostPreview }) {
  const { data: session } = useSession();

  const router = useRouter();
  const { title, content } = post.data;

  useEffect(() => {
    if ((session as ISessionActiveSubscription)?.activeSubscription) {
      router.push(`/post/${post.uid}`);
    }
  }, [post.uid, router, session]);

  return (
    <>
      <Head>
        <title>{`${title} | Ignews`}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{title}</h1>
          <time>{post.first_publication_date}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></div>
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">Subscribe now 🤗</Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { params } = context;
  const { uid } = params as Params;

  const client = createClient();
  const post = await client.getByUID('publication', uid);

  const postFormatted = {
    uid: post.uid,
    first_publication_date: new Date(
      post.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    last_publication_date: new Date(
      post.last_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    lang: post.lang,
    data: {
      title: prismicH.asText(post.data.title),
      content: prismicH.asHTML(post.data.content.slice(0, 3) as []),
    },
  };

  return {
    props: {
      post: postFormatted,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
