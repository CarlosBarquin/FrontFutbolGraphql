
import { GetServerSideProps, NextPage } from "next"
import Player from '@/components/Player'

export const getServerSideProps: GetServerSideProps = async (context) => {

    const {playerN}  = context.query
    
    return {    
        props: {
            playerN
        }
    }

}

const Page : NextPage<{playerN:string}> = ({playerN}) => {
    return (
        <>
            <Player id={playerN}/>
        </>
    )
}

export default Page