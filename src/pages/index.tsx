import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Prismic from '@prismicio/client';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { RiCalendarLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const { next_page, results } = postsPagination;
  const [posts, setPosts] = useState(results);
  const [nextPageLink, setNextPageLink] = useState(next_page);

  const loadMorePosts = async e => {
    e.preventDefault();

    const response = await fetch(nextPageLink);
    const json = await response.json();
    setPosts(posts.concat(json.results));
    setNextPageLink(json.next_page);
  };

  return (
    <main className={commonStyles.container}>
      {posts.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <a>
            <section className={styles.post}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <RiCalendarLine size={20} />
                  {post.first_publication_date}
                </span>
                {!post.data.author === false && (
                  <span>
                    <FiUser size={20} />
                    {post.data.author}
                  </span>
                )}
              </div>
            </section>
          </a>
        </Link>
      ))}

      {!postsPagination.next_page === false && (
        <button
          type="button"
          className={styles.postButton}
          onClick={loadMorePosts}
        >
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'blogposts'),
    { pageSize: 5 }
  );

  // console.log(JSON.stringify(postsResponse, null, 2));

  const { results, next_page } = postsResponse;

  // console.log(next_page);

  const posts = results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'd LLL uuu',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page,
        results: posts,
      },
    },
  };
};
