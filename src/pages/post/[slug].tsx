import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RiCalendarLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { MdOutlineWatchLater } from 'react-icons/md';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <img src="/Banner.svg" alt="" className={styles.banner} />
      <section className={commonStyles.container}>
        <div className={styles.text}>
          <h1>{post.data.title}</h1>
          <div>
            <span>
              <RiCalendarLine size={20} />
              {post.first_publication_date}
            </span>
            <span>
              <FiUser size={20} />
              {post.data.author}
            </span>
            <span>
              <MdOutlineWatchLater size={20} />
              {post.first_publication_date}
            </span>
          </div>

          {post.data.content.map(content => (
            <article>
              <h2>{content.heading}</h2>
              <p>{content.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('blogposts', String(slug), {});

  // console.log(JSON.stringify(response, null, 2));

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'd LLL uuu',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner,
      },
      author: response.data.author,
      content: response.data.content.map(description => {
        const contentObj = {
          heading: description.heading,
          body:
            description.body.find(body => body.type === 'paragraph')?.text ??
            '',
        };
        return contentObj;
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
