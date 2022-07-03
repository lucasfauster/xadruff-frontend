import "./Tile.css";

interface Props {
  id: string;
  image: string;
  color: number;
  pieceColor: string;
  lastMovement: string;
  kingInCheckPosition: string;
}

export default function Tile({ id, image, color, pieceColor, lastMovement, kingInCheckPosition }: Props) {
  let extraClassName = ""
  if(kingInCheckPosition.includes(id)){
    extraClassName += " king-in-check"
  }

  if (color % 2 === 0) {
    if (lastMovement.includes(id)) {
      extraClassName += " movement-dark-tile"
    }
    return (
      <div id={id} className={`tile dark-tile ${extraClassName}`} data-testid={`test-dark-tile-${id}`}>
        {image && (
          <div
            data-testid = {id}
            style={{ backgroundImage: `url(${image})` }}
            className={`${pieceColor} piece`}
          ></div>
        )}
      </div>
    );
  } else {
    if (lastMovement.includes(id)) {
      extraClassName += " movement-light-tile"
    }
    return (
      <div id={id} className={`tile light-tile ${extraClassName}`} data-testid={`test-light-tile-${id}`}>
        {image && (
          <div
            data-testid = {id}
            style={{ backgroundImage: `url(${image})` }}
            className={`${pieceColor} piece`}
          ></div>
        )}
      </div>
    );
  }
}
