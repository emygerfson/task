import style from "./style.module.css"
import Head from "next/head"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

import Textarea from "../../components/Textarea"

import { FiShare2 } from "react-icons/fi"
import { FaTrash } from "react-icons/fa"

import { ChangeEvent, useState, SyntheticEvent, useEffect } from "react"

import Link from "next/link"

import { db } from "../../service/firebase"
import { addDoc, collection, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc } from "firebase/firestore"

interface HomeProps {
  user: { email: string }
}
interface TaskProps {
  id: string
  tarefa: string
  public: boolean
  user: string
  created: Date
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("")
  const [publicTask, setPublicTask] = useState(false)
  const [tarefas, setTarefas] = useState<TaskProps[]>([])

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas")
      const q = query(
        tarefasRef,
        where("user", "==", user?.email),
        orderBy("created", "desc")
      )
      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[]
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            public: doc.data().public,
            user: doc.data().user,
            created: doc.data().created.toDate() // converte Timestamp para Date
          })
        })
        setTarefas(lista)
      })
    }
    loadTarefas()
  }, [user?.email])

  function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
    setPublicTask(e.target.checked)
  }

  async function handleregisterTask(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (input === "") return

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        public: publicTask,
        user: user?.email,
        created: Timestamp.now() // usa Timestamp do Firestore
      })
      setInput("")
      setPublicTask(false)
    } catch (error) {
      console.log(error)
    }
  }
  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
  }
  async function handleDelete(id: string) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  return (
    <div className={style.container}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className={style.main}>
        <section className={style.content}>
          <div className={style.formContent}>
            <h1 className={style.title}>Qual sua tarefa</h1>
            <form className={style.form} onSubmit={handleregisterTask}>
              <Textarea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                placeholder="Digite sua tarefa"
              />
              <div className={style.checkboxTexarea}>
                <input
                  checked={publicTask}
                  onChange={handleChangePublic}
                  type="checkbox"
                  className={style.checkbox}
                />
                <label>Deixar Tarefas Públicas?</label>
              </div>
              <button className={style.button} type="submit">Registrar</button>
            </form>
          </div>
        </section>

        <section className={style.taskContainer}>
          <h1>Minhas tarefas</h1>
          {tarefas.map((item) => (
            <article key={item.id} className={style.task}>
              {item.public && (
                <div className={style.tagcontent}>
                  <label className={style.tag}>PÚBLICO</label>
                  <button className={style.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={style.taskContent}>
                {item.public ? (
                    <Link href={`/task/${item.id}`}>
                      <p>{item.tarefa}</p>
                    </Link>
                    
                ) : (
                  <p>{item.tarefa}</p>
                )}
                <button className={style.trashButton} onClick={() => handleDelete(item.id)}>
                  <FaTrash size={22} color="#ea4335" />
                </button>
              </div>
            </article>
          ))}
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
        props: {
            user:{
                email: session?.user?.email
            }
        }
    }
}