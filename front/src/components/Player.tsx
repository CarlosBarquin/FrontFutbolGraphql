import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import styled from "styled-components";
import { FC, use, useEffect, useState } from "react";

const ADD_PLAYER = gql`
  mutation CreatePlayer($name: String) {
    createPlayer(name: $name) {
      id
      name
    }
  }
`;
const PLAYER = gql`
  query ($playerId: ID!) {
    player(id: $playerId) {
      id
      name
      team {
        name
      }
    }
  }
`;

const UP_TEAM = gql`
  mutation ($updateTeamId: ID!, $players: [ID!]) {
    updateTeam(id: $updateTeamId, players: $players) {
      id
      name
      players {
        name
      }
    }
  }
`;

const TEAMS = gql`
  query {
    teams {
      id
      name
      players {
        id
        name
      }
      matches {
        id
        team1 {
          id
          name
        }
        team2 {
          id
          name
        }
        goals_team1
        goals_team2
        date
        status
      }
      goals_for
      goals_against
      classified
    }
  }
`;
const pagina: FC<{ id: string }> = ({ id }) => {
  const [playerId, setPlayerId] = useState<string>("");
  const [ESTOYARTO, setESTOYARTO] = useState<boolean>(false);

  const [idT, setIdT] = useState<string>("");
  const [playersT, setPlayersT] = useState<string[]>([]);
  const [E, setE] = useState<number>(0);
  const [E2, setE2] = useState<number>(0);

  const [id2, setId2] = useState<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (playerId === "") return;
    refetch();
  }, [playerId]);

  //por una estraña razon que no logro comprender, hace este codigo dos veces asique he tendio que poner otro useeffect debajo
  useEffect(() => {
    setESTOYARTO(true);
  }, []);

  useEffect(() => {
    if (ESTOYARTO === false) return;
    addplayer();
  }, [ESTOYARTO]);

  const [addplayer] = useMutation(ADD_PLAYER, {
    variables: { name: id },
    onCompleted: (data) => {
      setPlayerId(data.createPlayer.id);
    },
    onError: (error) => {
      const errorMessage = error.message;
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement!.textContent = errorMessage;
    },
  });

  const [updateTeam] = useMutation(UP_TEAM, {
    variables: { updateTeamId: idT, players: [...playersT, playerId] },
    onCompleted: () => {
      r();
      refetch();
    },
    onError: (error) => {
      const errorMessage = error.message;
      const errorMessageElement = document.getElementById("error-message2");
      errorMessageElement!.textContent = errorMessage;
    },
  });

  const [updateTeam2] = useMutation(UP_TEAM, {
    variables: { updateTeamId: idT, players: playersT },
    onCompleted: () => {
      r();
      refetch();
    },
    onError: (error) => {
      const errorMessage = error.message;
      const errorMessageElement = document.getElementById("error-message2");
      errorMessageElement!.textContent = errorMessage;
    },
  });


  useEffect(() => {
    if (idT === "") return;
    updateTeam();
  }, [E]);

  useEffect(()=>{
    if(idT === "") return
    updateTeam2()
  },[E2])

  const { loading, error, data, refetch } = useQuery<{
    player: {
      id: string;
      name: string;
      team: {
        name: string;
      };
    };
  }>(PLAYER, {
    variables: { playerId: playerId },
  });

  const { data: d, refetch: r } = useQuery<{
    teams: Team[];
  }>(TEAMS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div id="error-message"></div>
      <div id="error-message2"></div>
      <Titulo>DATOS PERSONALES</Titulo>
      <div>
        <br></br>
        <li>{data?.player.id}</li>
        <li>{data?.player.name}</li>
        <li>
          {data?.player.team === null ? "no team" : data?.player.team.name}
        </li>
      </div>
      <br></br>
      <Titulo>EQUIPOS</Titulo>
      <Formulario>
        <Header>nombre</Header>
        <Header>goles a favor</Header>
        <Header>goles en contra</Header>
        <Header>clasificado</Header>
        <Header>partidos</Header>
        <Header>jugadores</Header>
        <Header></Header>
        {d?.teams.map((t, index) => {
          return (
            <>
              <Celda>{t.name}</Celda>
              <Celda>{t.goals_for}</Celda>
              <Celda>{t.goals_against}</Celda>
              <Celda>{t.classified ? "clasificado" : "no clasificado"}</Celda>

              <Celda2
                onClick={() => {
                  if (ids.includes(t.id)) {
                    setIds(ids.filter((id) => id !== t.id));
                  } else {
                    setIds([...ids, t.id]);
                  }
                }}
              >
                ver partidos
              </Celda2>

              <Celda2
                onClick={() => {
                  if (id2.includes(t.id)) {
                    setId2(id2.filter((id) => id !== t.id));
                  } else {
                    setId2([...id2, t.id]);
                  }
                }}
              >
                ver jugadores
              </Celda2>


              <Celda>
                {" "}
                <button
                  onClick={() => {
                    setIdT(t.id);
                    setPlayersT(t.players.map((e) => e.id));
                    setE(E + 1);
                  }}
                >
                  unirse
                </button>{" "}

                <button onClick={()=> {
                    setIdT(t.id);
                    setPlayersT(t.players.map((e) => e.id).filter((e)=> e !== playerId));
                    setE2(E2+1)
                }}>
                  salir
                </button>
              </Celda>

              {(id2.includes(t.id) || ids.includes(t.id)) && (
                <>
                  <Celda></Celda>
                  <Celda></Celda>
                  <Celda></Celda>
                  <Celda></Celda>
                  <Celda>
                    {ids.includes(t.id)  && (
                    <>
                      {t.matches.length === 0
                      ? "no hay partidos"
                      : t.matches.map((p) => {
                          return (
                            <>
                              {" "}
                              <li>
                                    {new Date(p.date).toLocaleDateString() } -- Rival:{" "}
                                    {p.team1.id === t.id ? (
                                      <>{p.team2.name}</>
                                    ) : (
                                      <>{p.team1.name}</>
                                    )}
                                  </li>
                                  <br></br>
                            </>
                          );
                        })}
                    </>)}
                  </Celda>
                  <Celda>
                      {id2.includes(t.id) && (
                        <>
                     {t.players.length === 0
                      ? "no hay jugadores"
                      : t.players.map((p) => {
                          return (
                            <>
                              {" "}
                              <li>{p.name}</li>
                            </>
                          );
                        })}
                        </>
                      )}
                  </Celda>
                  <Celda></Celda>
                </>
              )}
            </>
          );
        })}
      </Formulario>
    </>
  );
};

const Formulario = styled.div`
  border: 1px solid #ccc;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
  grid-gap: 1px;
  background-color: #fff;
  color: #444;
  margin-bottom: 50px;
`;

const Header = styled.div`
  background-color: #f1f1f1;
  font-weight: bold;
  padding: 20px;
  text-align: left;
`;

const Celda = styled.div`
  padding: 10px 20px 10px 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const Titulo = styled.div`
  background-color: blue;
  font-weight: bold;
  padding: 20px;
  text-align: left;
  color: white;
`;

const Celda2 = styled.div`
  padding: 10px 20px 10px 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: powderblue;
  transition: background-color 0.5s;

  &:hover {
    background-color: gold;
  }
`;

type Team = {
  id: string;
  name: string;
  matches: Match[];
  players: Player[];
  goals_for: number;
  goals_against: number;
  classified: boolean;
};

enum MatchStatus {
  PENDING = "PENDING",
  FINISHED = "FINISHED",
  PLAYING = "PLAYING",
}

type Match = {
  id: string;
  team1: Team;
  team2: Team;
  goals_team1: number;
  goals_team2: number;
  date: Date;
  status: MatchStatus;
};

type Player = {
  id: string;
  name: string;
  team?: Team;
};

export default pagina;
