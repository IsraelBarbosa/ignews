import { createClient } from '@/services/prismicio';
import * as prismicH from '@prismicio/helpers';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

import styles from './uid.module.scss';
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

type Post = {
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

export default function Post({ post }: { post: Post }) {
  const { title, content } = post.data;

  console.log(title, 'post');

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{title}</h1>
          <time>{post.first_publication_date}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, params } = context;
  const { uid } = params as Params;
  const session = (await getSession({ req })) as ISessionActiveSubscription;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

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
      content: prismicH.asHTML(post.data.content),
    },
  };

  return {
    props: {
      post: postFormatted,
    },
  };
};
