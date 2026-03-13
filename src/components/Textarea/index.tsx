import { HTMLProps } from "react"
import stely from "./style.module.css"

export default function Textarea({...rest}: HTMLProps<HTMLTextAreaElement>) {
    return (
        <textarea className={stely.textarea}{...rest}></textarea>
    )
}