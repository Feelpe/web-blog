import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RiCalendarLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { MdOutlineWatchLater } from 'react-icons/md';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  reading_time: string | null;
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
              {post.reading_time} min
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

  const wordRegex = /\w+/g; // regex para buscar apenas palavras

  const totalWords = response.data.content.reduce((acc, curr) => {
    const headingText = curr.heading ? curr.heading : '';
    const headingWords = headingText.match(wordRegex).length;

    const bodyText =
      curr.body.find(body => body.type === 'paragraph')?.text ?? '';
    const bodyWords = bodyText.match(wordRegex).length;

    return acc + (headingWords + bodyWords);
  }, 0);

  const estimatedReadingTime = Math.ceil(totalWords / 200);

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'd LLL uuu',
      { locale: ptBR }
    ),
    reading_time: estimatedReadingTime,
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

  // console.log(JSON.stringify(post.reading_time, null, 2));

  return {
    props: {
      post,
    },
  };
};
