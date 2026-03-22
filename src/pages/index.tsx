import { GetStaticProps } from 'next'

import styles from '../styles/Home.module.css'

import Head from 'next/head'
import Image from 'next/image'

import heroImg from'../../public/assets/hero.png'

import {db} from '../service/firebase'

import {collection, getDocs} from 'firebase/firestore'

interface HomeProps {
  comments: number;
  posts: number
}
export default function Home({posts, comments}: HomeProps) {
  return (
    
    <div className={styles.container}>
      <Head>
      <title>Tarefas + | Organize suas tarefas de forma facil</title>      
      </Head>
      <main className={styles.logoContent}>
        <Image 
          className={styles.hero}
          src={heroImg} 
          alt=" Logo" 
          priority
        />
        <h1 className={styles.title}>Sistema feito para você organizar <br/> seus estudos e tarefas </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>{posts} Post</span>
          </section>
          < section className={styles.box}>
            <span>{comments} Comentários</span>
          </section>
        </div>
      </main>
      
    </div>
    
  )
    
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {

  const commentRef = collection(db, "comments")
  const postRef = collection(db, "tarefas")

  const commentsSnapshot = await getDocs(commentRef)
  const postSnapshot = await getDocs(postRef)

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentsSnapshot.size || 0
    },
    revalidate: 60 // opcional: revalida a cada 60s
  }
}
