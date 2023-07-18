import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import styled from "styled-components";
import { FC, use, useEffect, useState } from "react";

const PLAYERS = gql`
  query {
    players {
      id
      name
      team {
        name
      }
    }
  }
`;

const MATCHES = gql`
  query {
    matches {
      id
      date
      team1 {
        name
      }
      team2 {
        name
      }
      status
      goals_team1
      goals_team2
    }
  }
`;

const ADD_PLAYER = gql`
  mutation ($updateTeamId: ID!, $players: [ID!]) {
    updateTeam(id: $updateTeamId, players: $players) {
      id
      players {
        name
      }
    }
  }
`;

const ADD_MACTH = gql`
  mutation (
    $team1: ID!
    $team2: ID!
    $goalsTeam1: Int!
    $goalsTeam2: Int!
    $date: String!
    $status: MatchStatus!
  ) {
    createMatch(
      team1: $team1
      team2: $team2
      goals_team1: $goalsTeam1
      goals_team2: $goalsTeam2
      date: $date
      status: $status
    ) {
      id
      date
    }
  }
`;

const UPDATE2_TEAM = gql`
  mutation ($updateTeamId: ID!, $classified: Boolean) {
    updateTeam(id: $updateTeamId, classified: $classified) {
      id
    }
  }
`;

const Delete_TEAM = gql`
  mutation ($deleteTeamId: ID!) {
    deleteTeam(id: $deleteTeamId) {
      id
    }
  }
`;

const ADD_TEAM = gql`
  mutation ($name: String!, $players: [ID!]!, $classified: Boolean!) {
    createTeam(name: $name, players: $players, classified: $classified) {
      id
    }
  }
`;

const UPD_MATCH = gql`
mutation($updateMatchId: ID!, $goalsTeam1: Int!, $goalsTeam2: Int!, $status: MatchStatus!){
    updateMatch(id: $updateMatchId, goals_team1: $goalsTeam1, goals_team2: $goalsTeam2, status: $status) {
      id
    }
  }
`

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
const pagina = () => {
  const [idT, setIdT] = useState<string>("");
  const [playersT, setPlayersT] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<string>("");
  const [E, setE] = useState<number>(0);
  const [E2, setE2] = useState<number>(0);
  const [E3, setE3] = useState<number>(0);
  const [E4, setE4] = useState<number>(0);

  const [id2, setId2] = useState<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [ids2, setIds2] = useState<string[]>([]);

  const [idD, setIdD] = useState<string>("");
  const [idD2, setIdD2] = useState<string>("");

  const [name, setName] = useState<string>("");

  const [idT1, setIdT1] = useState<string>("");
  const [idT2, setIdT2] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date(0,0,0,0));

  const [goles1 , setGoles1] = useState<number>(0);
  const [goles2 , setGoles2] = useState<number>(0);
  const [status, setStatus] = useState<MatchStatus>()
  const [idM, setIdM] = useState<string>("");


  const [createTeam] = useMutation(ADD_TEAM, {
    variables: { name: name, players: [], classified: false },
    onCompleted: () => {
      r();
      refetch();
    },
    onError: (error) => {
      const errorMessage = error.message;
      const errorMessageElement = document.getElementById("error-message2");
      errorMessageElement!.textContent = errorMessage;
      setTimeout(() => {
        errorMessageElement!.textContent = "";
      }, 5000);
    },
  });

  const [addMatch] = useMutation(ADD_MACTH, {
    variables: { team1 : idT1 , team2 : idT2 , date : date , status : MatchStatus.PENDING, goalsTeam1 : 0, goalsTeam2 : 0},
    onCompleted: () => {
      r();
      refetch();
      RM()
    },
    onError: (error) => {
      const errorMessage = error.message;
      const errorMessageElement = document.getElementById("error-message2");
      errorMessageElement!.textContent = errorMessage;
      setTimeout(() => {
        errorMessageElement!.textContent = "";
      }, 5000);
    },
  });

  const [deleteTeam] = useMutation(Delete_TEAM, {
    variables: { deleteTeamId: idD },
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
    if (idD === "") return;
    deleteTeam();
  }, [idD]);

  const [updateTeam] = useMutation(ADD_PLAYER, {
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

  useEffect(() => {
    if (idT === "") return;

    d?.teams.map((t) => {
      if (t.id === idT) {
        setPlayersT(t.players.map((e) => e.id));
        setE(E + 1);
      }
    });
  }, [E2]);

  useEffect(() => {
    if (idT === "") return;
    updateTeam();
  }, [E]);

  const [updateTeam2] = useMutation(UPDATE2_TEAM, {
    variables: { updateTeamId: idD2, classified: true },
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
    if (idD2 === "") return;
    updateTeam2();
  }, [E3]);

  const [updateMatch] = useMutation(UPD_MATCH, {
    variables: { updateMatchId: idM, goalsTeam1 : goles1, goalsTeam2 : goles2, status : status },
    onCompleted: () => {
      r();
      refetch();
      RM()
    },
    onError: (error) => {
      const errorMessage = error.message;
      const errorMessageElement = document.getElementById("error-message2");
      errorMessageElement!.textContent = errorMessage;
    },
  });

  useEffect(()=> {
    if(idM === "" )return
    updateMatch()
  },[E4])

  

  const { loading, error, data, refetch } = useQuery<{
    players: {
      id: string;
      name: string;
      team: {
        name: string;
      };
    }[];
  }>(PLAYERS);

  const data2 = data?.players.filter((p) => p.team === null);

  const { data: d, refetch: r } = useQuery<{
    teams: Team[];
  }>(TEAMS);

  const { data: DM, refetch: RM } = useQuery<{
    matches: Match[];
  }>(MATCHES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div id="error-message2"></div>
      <Titulo>JUGADORES SIN EQUIPO</Titulo>
      <div>
        {data2?.map((player) => {
          return (
            <>
              <br></br>
              <li>
                {player.id} -- {player.name} --
                <select
                  onChange={(e) => {
                    setPlayerId(player.id);
                    setIdT(e.target.value);
                  }}
                >
                  <option>select</option>

                  {d?.teams.map((e) => {
                    return (
                      <>
                        <option value={e.id}>{e.name}</option>
                      </>
                    );
                  })}
                </select>
                --
                <button
                  onClick={() => {
                    setE2(E2 + 1);
                  }}
                >
                  añadir
                </button>
              </li>
            </>
          );
        })}
      </div>
      <br></br>
      <Titulo>EQUIPOS</Titulo>
      <input
        type="text"
        placeholder="Nombre del equipo"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button
        onClick={() => {
          createTeam();
        }}
      >
        Crear equipo
      </button>

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
                    setIdD(t.id);
                  }}
                >
                  borrar
                </button>{" "}
                <button
                  onClick={() => {
                    setIdD2(t.id);
                    setE3(E3 + 1);
                  }}
                >
                  Clasificar
                </button>
              </Celda>

              {(id2.includes(t.id) || ids.includes(t.id)) && (
                <>
                  <Celda></Celda>
                  <Celda></Celda>
                  <Celda></Celda>
                  <Celda></Celda>
                  <Celda>
                    {ids.includes(t.id) && (
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
                      </>
                    )}
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
      <br></br>
      <Titulo>PARTIDOS</Titulo>


      <select
        onChange={(e) => {
          setIdT1(e.target.value);
        }}
      >
        <option>select</option>

        {d?.teams.map((e) => {
          return (
            <>
              <option value={e.id}>{e.name}</option>
            </>
          );
        })}
      </select>


      <select
        onChange={(e) => {
          setIdT2(e.target.value);
        }}
      >
        <option>select</option>

        {d?.teams.map((e) => {
          return (
            <>
              <option value={e.id}>{e.name}</option>
            </>
          );
        })}
      </select>

      <input type="datetime-local" placeholder="date" onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setDate(newDate);
        }} />

        <button onClick={()=> {
           if(idT1 === idT2) return
           addMatch()
        }}>añadir partido</button>

      <Formulario2>
        <Header>Team1</Header>
        <Header>Team2</Header>
        <Header>Puntiacion</Header>
        <Header>Date</Header>
        <Header>Status</Header>
        <Header></Header>
        {DM?.matches.map((M)=> {
            return(
                <>
                    <Celda>{M.team1.name}</Celda>
                    <Celda>{M.team2.name}</Celda>
                    <Celda>{M.goals_team1} - {M.goals_team2}</Celda>
                    <Celda>{new Date(M.date).toLocaleDateString()}</Celda>
                    <Celda>{M.status}</Celda>
                    <Celda><button onClick={()=>{
                        if (ids2.includes(M.id)) {
                            setIds2(ids2.filter((id) => id !== M.id));
                        } else {
                            setIds2([...ids2, M.id]);
                        }
                        setStatus(M.status)
                        
                    }}>editar</button></Celda>

                    {ids2.includes(M.id) && (
                        <>
                        <Celda>Goles1 : <input type="number" placeholder="0" onChange={(e)=> setGoles1(parseInt(e.target.value))}></input></Celda> 
                        <Celda>Goles2 : <input type="number" placeholder="0" onChange={(e)=> setGoles2(parseInt(e.target.value))}></input></Celda> 
                        <Celda></Celda>
                        <Celda></Celda>
                        <Celda> 
                        <select
                            onChange={(e) => {
                                if(e.target.value === "pending") setStatus(MatchStatus.PENDING)
                                if(e.target.value === "finished") setStatus(MatchStatus.FINISHED)
                                if(e.target.value === "playing") setStatus(MatchStatus.PLAYING)
                            }}
                        >
                            <option>select</option>
                            <option value="pending">PENDING</option>
                            <option value="finished">FINISHED</option>
                            <option value="playing">PLAYING</option>
                        </select>
                        </Celda>
                        <Celda>
                            <button onClick={()=> {
                                setIdM(M.id)
                                setE4(E4+1)
                            }}>actualizar</button>
                        </Celda>
                        </>
                    )}
                </>
            )
        })}
      </Formulario2>
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
const Formulario2 = styled.div`
  border: 1px solid #ccc;
  display: grid;
  grid-template-columns:  1fr 1fr 1fr 1fr 1fr 0.3fr;
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
