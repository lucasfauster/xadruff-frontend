import {ChessResponse} from "../components/Board/BoardRenderer";
import {BoardRequest} from "../components/Board/BoardStates";


export function startNewGame(start_by: string, boardRequest: BoardRequest, level: string): Promise<ChessResponse> {
    return fetch(`https://xadruff-backend.herokuapp.com/chess/new-game?start-by=${start_by}&level=${level}`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(boardRequest)
        },
    ).then(data => data.json())
}

export function makeMovement(board_id: string, move: string): Promise<ChessResponse> {
    return fetch(`https://xadruff-backend.herokuapp.com/chess/move?board-id=${board_id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"move": move})
    }).then(data => data.json())
}

export function surrender(board_id: string): Promise<ChessResponse> {
  return fetch(`https://xadruff-backend.herokuapp.com/chess/surrender?board-id=${board_id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then(data => data.json())
}