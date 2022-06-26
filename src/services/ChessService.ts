import {ChessResponse} from "../components/Board/Board";

export function startNewGame(start_by: string): Promise<ChessResponse> {
    return fetch(`https://xadruff-backend.herokuapp.com/chess/new-game?start-by=${start_by}&level=INTERMEDIATE`)
        .then(data => data.json())
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

