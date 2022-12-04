// SPA (Single Page Application)
// SSR (server-side Rendering)
// SSG (Static Server Generation)

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx//
//=========== chamada de API com estratégia de SPA ===================//
// -- isso para indexação pode ser ruim, uma vez que os crowlers terão que esperar o retorno da chamada e a construção do HTML em tela.

// import { useEffect } from "react"

// export default function Home() {

//     useEffect( () => {
//         fetch('http://localhost:3333/episodes')
//             .then(response => response.json())
//             .then(data => console.log(data))
//     }, [])

//     return (
//         <h1>Index</h1>
//     )
// }

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx//
//======== chamada de API com estratégia de SSR  ===================//
// -- utilizando export async funcion getServerSideProps() {} dentro de qualquer arquivo dentro de 'pages', faz com que essa função seja a primeira a ser executada, assim já entregando os dados para indexação.

// export default function Home(props) {

//     return (
//         <>
//             <h1>Index</h1>
//         </>
//     )
// }

// export async function getServerSideProps() {
//     const response = await fetch('http://localhost:3333/episodes')
//     const data = await response.json()

//     return {
//         props: {
//             episodes: data
//         }
//     }
// }



//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx//
//======== chamada de API com estratégia de SSG  ===================//
// -- Assim que alguém acessa a página, é gerada uma versão estática (em html puro) que será distribuída para todos os demais. Será atualizada de acordo com a frequência definida. É o mesmo código, basta alterar o nome da função para getStaticProps(){}; e no retorno, após o 'props', informar o 'revalidate' com o período que a página será gerada novamente --//
// export default function Home(props) {
//     return (
//         <div>
//             <h1>Index</h1>
//             <p>{JSON.stringify(props.episodes)}</p>
//         </div>
//     )
// }

// export async function getStaticProps() {
//     const response = await fetch('http://localhost:3333/episodes')
//     const data = await response.json()

//     return {
//         props: {
//             episodes: data
//         },
//         revalidate: 60 * 60 * 8
//     }
// }
//=======================================================================================================//
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns'
import { api } from '../services/api'


type Episode = {
  id: string,
  title: string,
  members: string,
  published_at: string
}

type HomeProps = {
  episodes: Array<Episode>
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{props.episodes[1].title}</p>
    </div>
  )
}

// acessa a API e faz um get nos dados
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
      }
  })
    
  // pega os dados do JSON que são retornados em um obj, faz um .map e trata todos os formatos da maneira desejada
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR} ),
      duration: Number(episode.file.duration),
      description: episode.description,
      url: episode.file.url
    }
  })

  return {
    props: {
      episodes: data
      },
      revalidate: 60 * 60 * 8
  }
}


