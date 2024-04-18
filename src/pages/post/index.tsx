import Head from 'next/head';
import styles from './styles.module.scss';
import { createClient } from '@/services/prismicio';
import { GetStaticProps } from 'next';
import Link from 'next/link';

interface ContentItem {
  type: string;
  text: string;
  spans: [];
  direction: string;
}

type Post = {
  uid: string;
  first_publication_date: string;
  last_publication_date: string;
  lang: string;
  data: {
    title: ContentItem[];
    content: ContentItem[];
  };
};

type TPosts = { posts: Post[] };

export default function Posts({ posts }: TPosts) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <time>{post.first_publication_date}</time>
              <strong>{post.data.title[0].text}</strong>
              <p>{post.data.content[0].text}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient();
  const posts = await client.getAllByType('publication');

  const postsFormatted = posts.map((post) => {
    return {
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
        title: post.data.title,
        content: post.data.content,
      },
    };
  });

  return {
    props: {
      posts: postsFormatted,
    },
  };
};
