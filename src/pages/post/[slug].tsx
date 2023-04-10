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

export default function Post({ post }: PostProps) {
  return (
    <>
      <img src="/Banner.svg" alt="" className={styles.banner} />
      <section className={commonStyles.container}>
        <div className={styles.text}>
          <h1>{post.data.title}</h1>
          <div>
            <span>
              <RiCalendarLine size={20} /> 15 Mar 2021
            </span>
            <span>
              <FiUser size={20} /> Joseph Oliveira
            </span>
            <span>
              <MdOutlineWatchLater size={20} /> 4 min
            </span>
          </div>

          <h2>Lorem ipsum, dolor sit amet</h2>

          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste</p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste sint
            porro rerum sequi?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste
            tenetur, consectetur aspernatur vel, expedita modi dolorem, libero
            sint porro rerum sequi?
          </p>
        </div>
      </section>
    </>
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
