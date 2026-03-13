import style from "./style.module.css"
import Head from "next/head"
import { GetServerSideProps } from "next"
import{ getSession} from "next-auth/react"

import Textarea from "../../components/Textarea"

import{ FiShare2 } from "react-icons/fi"
import{FaTrash} from "react-icons/fa"
export default function Dashboard() {
    return (
        <div className={style.container}>
            <Head>
                <title>Dashboard</title>
            </Head>
            <main className={style.main}>
                <section className={style.content}>
                    <div className={style.formContent}>
                        <h1 className={style.title}>Qual sua tarefa</h1>
                        <form className={style.form}>
                            <Textarea placeholder="Digite sua tarefa"/>
                            <div className={style.checkboxTexarea}>
                                <input type="checkbox" className={style.checkbox} />
                                <label>Deixar Tarefas Publicar?</label>
                            </div>
                            <button className={style.button} type="submit">Registrar</button>
                        </form>
                    </div>
                </section>

                <section className={style.taskContainer}>
                    <h1>Minhas tarefas</h1>
                    <article className={style.task}>
                        <div className={style.tagcontent}>
                            <label className={style.tag}>PUBLICO</label>
                            <button className={style.shareButton}><FiShare2 size={22} color="#3183ff"/></button>
                        </div>

                        <div className={style.taskContent}>
                            <p>Minha primeiro tarefa de exemplo show demais!</p>
                            <button className={style.trashButton}><FaTrash size={22} color="#ea4335"/></button>
                        </div>

                    </article>
                </section>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req})  
    if(!session?.user){
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }

    } 
    
    return {
        props: {}
    }
}