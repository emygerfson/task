import styles from '../styles/Home.module.css'

import Head from 'next/head'
import Image from 'next/image'

import heroImg from'../../public/assets/hero.png'
export default function Home() {
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
            <span>+20 Post</span>
          </section>
          < section className={styles.box}>
            <span>+90 Comentários</span>
          </section>
        </div>
      </main>
      
    </div>
    
  )
    
}
