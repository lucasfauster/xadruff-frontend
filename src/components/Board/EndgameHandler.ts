export const yourTurn = "Sua vez"
export const adversaryTurn = "Vez do adversário"

export function setWinner(winner: string) {
    switch(winner) {
        case("WHITE"): return "Vitória das brancas"
        case ("BLACK"): return "Vitória das pretas"
        case ("DRAW"): return "Empate"
    }
}

export function setWinnerMotive(winnerMotive: string) {
    switch(winnerMotive) {
        case("Ended by checkmate."): return "por xeque-mate"
        case ("Draw by stalemate."): return "por afogamento do rei"
        case ("Draw by 50 movements rule."): return "por regra de 50 movimentos"
        case ("Ended by surrender."): return "por desistência"
    }
}