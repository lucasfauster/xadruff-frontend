import "./Tile.css";

interface Props {
  id: string;
  image: string;
  color: number;
  pieceColor: string;
  lastMovement: string;
}

export default function Tile({ id, image, color, pieceColor, lastMovement }: Props) {
  let extraClassName = ""
  if (lastMovement.includes(id)) {
    extraClassName = "movement-tile"
  }
  if (color % 2 === 0) {
    return (
      <div id={id} className={`tile dark-tile ${extraClassName}`} data-testid="test-dark-tile">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={`${pieceColor} piece`}
          ></div>
        )}
      </div>
    );
  } else {
    return (
      <div id={id} className={`tile light-tile ${extraClassName}`} data-testid="test-light-tile">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={`${pieceColor} piece`}
          ></div>
        )}
      </div>
    );
  }
}
