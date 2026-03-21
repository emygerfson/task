import { ChangeEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { GetServerSideProps } from "next";
import Head from "next/head";
import style from "./style.module.css"

import {db} from "../../service/firebase"
import { doc, collection,query,where, getDoc, getDocs,addDoc} from "firebase/firestore"

import Textarea from "../../components/Textarea"
import { create } from "node:domain";
import {FaTrash} from "react-icons/fa"

interface TaskProps {
  item:{
  id: string
  tarefa: string
  user: string
  created: string
  public: boolean
  };
  allcomments: CommentProps[]
}
interface CommentProps {
  id: string
  comment: string
  user: string
  name: string
  taskId: string
}

export default function Task({item , allcomments}: {item: TaskProps, allcomments: CommentProps[]}) {

  const { data: session } = useSession()
  const [input, setInput] = useState("")
  const [comments, setComments] = useState<CommentProps[]>(allcomments || [])

  async function handleComent(e: ChangeEvent<HTMLFormElement>){
    e.preventDefault()
    if(input === "") return

    if (!session?.user?.email) return

    try {
      const commentRef = collection(db, "comments")
      const docRef = await addDoc(commentRef, {
        comment: input,
        created: new Date(),
        name: session?.user?.name,
        user: session?.user?.email,
        taskId: item.id
      })
      const data ={
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item.id
      }
      

      type CommentData = Omit<CommentProps, 'id'> & {
      id: string;
      };
      setComments((oldItems) => [...oldItems, { ...data, id: docRef.id } as CommentProps]);
      setInput("")
    } catch (error) {
      console.log(error)
    }
  }

    return (
      <div className={style.container}> 
        <Head>
          <title>Detalhes da tarefa</title>
        </Head>
        <main className={style.main}>
            <h1>Tarefas</h1>
            <article className={style.task}>
                <p>{item.tarefa}</p>
                
            </article>
        </main>
        <section className={style.comments}>
          <h2>Deixe seu Comentario</h2>
          <form onSubmit={handleComent}>
            <Textarea 
            placeholder="deixe seu comentario"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>)=> setInput(e.target.value)}
            />
            <button
              className={style.button} 
              disabled={!session?.user}
            >
              Enviar Comentarios
            </button>
          </form>
        </section>

        <section className={style.comments}>
          <h2>Comentarios</h2>
          {comments.map((item) => (
            <article key={item.id} className={style.comment}>
              <div className={style.commentHeader}>
                <label className={style.label}>{item.name}</label>
                {item.user === session?.user?.email && (
                  <button className={style.buttonTrash}>
                  <FaTrash size={18} color="#ea3140"/>
                </button>
                )}
              </div>
              
              <p>{item.comment}</p>
            </article>
          ))}
        </section>

      </div>
    );
}

export const getServerSideProps : GetServerSideProps = async ({params}) => {
  const id = params?.id as string
  const docRef = doc(db,"tarefas",id)
  const q = query(collection(db,"comments"),where("taskId","==",id))
  const snapshotComments = await getDocs(q)
  let allcomments: CommentProps[] = [] 

  snapshotComments.forEach((doc) => {
    allcomments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId
    })
    
  })
  const snapshot = await getDoc(docRef)
  if(snapshot.data() === undefined){
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }

  }
  if(!snapshot.data()?.public){
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const mileseconds = snapshot.data()?.created?.seconds * 1000
  const task = {
    id: snapshot.id,
    tarefa: snapshot.data()?.tarefa,
    user: snapshot.data()?.user,
    created: new Date(mileseconds).toLocaleDateString(),
    public: snapshot.data()?.public
    
  }
  

  return {
    props: {
      item: task,
      allcomments: allcomments
    }
  }
}