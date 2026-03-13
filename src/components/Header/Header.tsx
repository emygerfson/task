import style from "./style.module.css"
import Link from "next/link"
import {useSession, signOut, signIn} from "next-auth/react"

export default function Header() {
    const {data: session, status} = useSession()

    return (
        <header className={style.header}>
            <section className={style.headerContent}>
                <nav className={style.nav}>
                    <Link href="/">
                    <h1 className={style.logo}>Tarefas <span>+</span></h1>
                    </Link>
                    {session?.user && (
                        <Link href="/dashboard">
                            <button className={style.link}>Meu Painel</button>
                        </Link>
                    )}
                </nav>
                {status === "loading" ? (
                    <></>
                ) : session ? (
                    <button className={style.button} onClick={() => signOut()}>Ola, {session.user?.name}</button>
                ) : (
                    <button className={style.button} onClick={() => signIn("google")}>Entrar</button>
                )
                }
            </section>
            
        </header>
    )
}