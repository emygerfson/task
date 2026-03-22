import { FormEvent, ChangeEvent, useState } from "react"
import { useSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import style from "./style.module.css"

import { db } from "../../service/firebase"
import { doc, collection, query, where, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore"

import Textarea from "../../components/Textarea"
import { FaTrash } from "react-icons/fa"

interface ItemProps {
  id: string
  tarefa: string
  user: string
  created: string
  public: boolean
}

interface CommentProps {
  id: string
  comment: string
  user: string
  name: string
  taskId: string
}

export default function Task({ item, allcomments }: { item: ItemProps; allcomments: CommentProps[] }) {
  const { data: session } = useSession()
  const [input, setInput] = useState("")
  const [comments, setComments] = useState<CommentProps[]>(allcomments || [])

  async function handleComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (input === "") return
    if (!session?.user?.email) return

    try {
      const commentRef = collection(db, "comments")
      const docRef = await addDoc(commentRef, {
        comment: input,
        created: new Date(),
        name: session?.user?.name,
        user: session?.user?.email,
        taskId: item.id,
      })

      const newComment: CommentProps = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name || "",
        taskId: item.id,
      }

      setComments((oldItems) => [...oldItems, newComment])
      setInput("")
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const commentDocRef = doc(db, "comments", commentId)
      await deleteDoc(commentDocRef)
      setComments(comments.filter((comment) => comment.id !== commentId))
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
        <h2>Deixe seu Comentário</h2>
        <form onSubmit={handleComment}>
          <Textarea
            placeholder="Deixe seu comentário"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          />
          <button className={style.button} disabled={!session?.user}>
            Enviar Comentário
          </button>
        </form>
      </section>

      <section className={style.comments}>
        <h2>Comentários</h2>
        {comments.map((comment) => (
          <article key={comment.id} className={style.comment}>
            <div className={style.commentHeader}>
              <label className={style.label}>{comment.name}</label>
              {comment.user === session?.user?.email && (
                <button className={style.buttonTrash} onClick={() => handleDeleteComment(comment.id)}>
                  <FaTrash size={18} color="#ea3140" />
                </button>
              )}
            </div>
            <p>{comment.comment}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string
  const docRef = doc(db, "tarefas", id)
  const q = query(collection(db, "comments"), where("taskId", "==", id))
  const snapshotComments = await getDocs(q)

  const allcomments: CommentProps[] = snapshotComments.docs.map((doc) => ({
    id: doc.id,
    comment: doc.data().comment,
    user: doc.data().user,
    name: doc.data().name,
    taskId: doc.data().taskId,
  }))

  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000
  const task: ItemProps = {
    id: snapshot.id,
    tarefa: snapshot.data()?.tarefa,
    user: snapshot.data()?.user,
    created: new Date(miliseconds).toLocaleDateString(),
    public: snapshot.data()?.public,
  }

  return {
    props: {
      item: task,
      allcomments,
    },
  }
}
