import { GetStaticProps } from 'next';
import { RiCalendarLine } from 'react-icons/ri';
import Prismic from '@prismicio/client';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
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
  return (
    <section className={commonStyles.container}>
      {postsPagination.results.map(post => (
        <div className={styles.post}>
          <h1>{post.data.title}</h1>
          <p>{post.data.subtitle}</p>
          <div>
            <span>
              <RiCalendarLine size={20} />
              {post.first_publication_date}
            </span>
            <span>
              <FiUser size={20} />
              {post.data.author}
            </span>
          </div>
        </div>
      ))}

      <button type="button" className={styles.postButton}>
        Carregar mais posts
      </button>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'blogposts'),
  ]);

  // console.log(JSON.stringify(postsResponse, null, 2));

  const { next_page } = postsResponse;

  const posts = postsResponse.results.map(post => {
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
