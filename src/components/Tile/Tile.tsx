import "./Tile.css";

interface Props {
  id: string;
  image: string;
  color: number;
  pieceColor: string;
}

export default function Tile({ id, image, color, pieceColor }: Props) {
  if (color % 2 === 0) {
    return (
      <div id={id} className="tile dark-tile" data-testid="test-dark-tile">
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
      <div id={id} className="tile light-tile" data-testid="test-light-tile">
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
