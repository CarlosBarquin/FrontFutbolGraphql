import Player from "@/components/Player";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [playerN , setPlayerN] = useState<string>("")
  return (
    <>
    <h1>REGISTRARSE COMO JUGDAOR: </h1>
    <input type="text" placeholder="name" onChange={(e) => setPlayerN(e.target.value)}></input>
    <Link href={`/jugador/${playerN}`}>
      <button>registrarse</button>
    </Link>

    <h1>GESTIONAR EQUIPOS </h1>
    <Link href={`/teams`}>
      <button>entrar</button>
    </Link>

    </>
  )
}
