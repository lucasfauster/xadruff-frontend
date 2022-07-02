import {ActiveLegalMovements, LegalMovements} from "./BoardRenderer";

export function handleCheckHighlight(movement: string, setKingInCheckPosition: Function){
    if(movement.includes("K")){
        const kingPosition = movement.split("K")[1]
        setKingInCheckPosition(kingPosition)
        document.getElementById(kingPosition)!.classList.add('king-in-check')
    } else {
        setKingInCheckPosition("")
    }
}

export function highlightLegalMovements(activeLegalMovements: ActiveLegalMovements, allLegalMovements: LegalMovements | null) {
    if (allLegalMovements) {
        activeLegalMovements.movements.forEach(function (movement) {
            let tile = document.getElementById(movement.slice(0, 2))!;
            if (movement.includes('C')) {
                highlightAttackMovement(tile);
            } else {
                highlightLegalMovement(tile);
            }
        });
    }
}

function highlightLegalMovement(tile: HTMLElement) {
    if (tile && tile.classList.contains('dark-tile')){
        tile.classList.add('legal-movements-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
        tile.classList.add('legal-movements-light-tile');
    }
}

function highlightAttackMovement(tile: HTMLElement) {
    if (tile && tile.classList.contains('dark-tile')){
        tile.classList.add('attack-movements-dark-tile');
    }
    else if (tile && tile.classList.contains('light-tile')){
        tile.classList.add('attack-movements-light-tile');
    }
}

export function unHighlightKingInCheck() {
    const kingInCheck = Array.from(document.getElementsByClassName('king-in-check'));
    kingInCheck.forEach(function (t){t.classList.remove('king-in-check');})
}

export function unHighlightLegalMovements(){
    const darkTiles = Array.from(document.getElementsByClassName('legal-movements-dark-tile'));
    const lightTiles = Array.from(document.getElementsByClassName('legal-movements-light-tile'));
    const darkAttackTiles = Array.from(document.getElementsByClassName('attack-movements-dark-tile'));
    const lightAttackTiles = Array.from(document.getElementsByClassName('attack-movements-light-tile'));
    darkTiles.forEach(function (t){t.classList.remove('legal-movements-dark-tile');})
    lightTiles.forEach(function (t){t.classList.remove('legal-movements-light-tile');})
    darkAttackTiles.forEach(function (t){t.classList.remove('attack-movements-dark-tile');})
    lightAttackTiles.forEach(function (t){t.classList.remove('attack-movements-light-tile');})
}