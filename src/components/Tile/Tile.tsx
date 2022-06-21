import "./Tile.css";

interface Props {
  id: string;
  image: string;
  color: number;
  piece_color: string;
}

export default function Tile({ id, image, color, piece_color }: Props) {
  if (color % 2 === 0) {
    return (
      <div id={id} className="tile dark-tile">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={`${piece_color} piece`}
          ></div>
        )}
      </div>
    );
  } else {
    return (
      <div id={id} className="tile light-tile">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={`${piece_color} piece`}
          ></div>
        )}
      </div>
    );
  }
}
