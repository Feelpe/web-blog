import { GetStaticPaths, GetStaticProps } from 'next';
import { RiCalendarLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { MdOutlineWatchLater } from 'react-icons/md';

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

export default function Post(): JSX.Element {
  return (
    <section>
      <h1>Criando um app CRA do zero</h1>
      <div>
        <div>
          <RiCalendarLine />
          <span>15 Mar 2021</span>
        </div>
        <div>
          <FiUser />
          <span>Joseph Oliveira</span>
        </div>
        <div>
          <MdOutlineWatchLater />
          <span>4 min</span>
        </div>
      </div>
    </section>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
