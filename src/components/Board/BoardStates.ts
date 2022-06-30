export interface BoardRequest {
    positions: string[][]
    turn_color: string
}

export function handleBoardState(state: string){
    switch(state) {
        case "EN_PASSANT":
            return enPassantBoard()
        case "CASTLE":
            return castleBoard()
        case "QUEEN_MADNESS":
            return queenMadnessBoard()
        case "CHECK_MATE":
            return checkMateBoard()
        case "PROMOTION":
            return promotionBoard()
        case "STALE_MATE":
            return staleMateBoard()
        default:
            return defaultBoard()
    }
}

function promotionBoard(){
    return {
        positions: [
            [" ", " ", " ", " ", "K", " ", " ", " "],
            ["P", "P", "P", "P", " ", "P", "P", "P"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["p", "p", "p", "p", " ", "p", "p", "p"],
            [" ", " ", " ", " ", "k", " ", " ", " "],
        ],
        turn_color: "WHITE"
    }
}

function staleMateBoard(): BoardRequest {
    return {
        positions: [
            [" ", " ", "k", " ", " ", " ", " ", " "],
            [" ", " ", "P", " ", " ", " ", " ", " "],
            [" ", " ", "q", " ", " ", " ", " ", " "],
            [" ", " ", "K", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
        ],
        turn_color: "WHITE"
    }
}

function checkMateBoard(): BoardRequest {
    return {
        positions: [
            ["k", " ", "r", "", " ", " ", " ", " "],
            [" ", " ", "Q", " ", " ", " ", " ", " "],
            [" ", "P", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", "B", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", "K", " ", " ", " ", " ", " "],
        ],
        turn_color: "WHITE"
    }
}

function queenMadnessBoard(): BoardRequest {
    return {
        positions: [
            ["q", "q", "q", "q", "k", "q", "q", "q"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["Q", "Q", "Q", "Q", "K", "Q", "Q", "Q"],
        ],
        turn_color: "WHITE"
    }
}

function defaultBoard(): BoardRequest {
    return {
        positions: [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ],
        turn_color: "WHITE"
    }
}

function castleBoard(): BoardRequest {
    return {
        positions: [
            [" ", " ", " ", " ", "k", " ", " ", "r"],
            [" ", " ", " ", " ", " ", " ", " ", "p"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["P", " ", " ", " ", " ", " ", " ", " "],
            ["R", " ", " ", " ", "K", " ", " ", " "],
        ],
        turn_color: "WHITE"
    }
}

function enPassantBoard(): BoardRequest {
    return {
        positions: [
            [" ", "k", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", "b", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", "p", " ", " ", " ", " "],
            ["q", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", "P", " ", " ", " "],
            [" ", "K", " ", " ", " ", " ", " ", " "],
        ],
        turn_color: "WHITE"
    }
}