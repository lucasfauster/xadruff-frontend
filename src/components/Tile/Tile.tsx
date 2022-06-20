import "./Tile.css";

interface Props {
  image: string;
  color: number;
}

export default function Tile({ color, image }: Props) {
  if (color % 2 === 0) {
    return (
      <div className="tile dark-tile">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="piece"
          ></div>
        )}
      </div>
    );
  } else {
    return (
      <div className="tile light-tile">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="piece"
          ></div>
        )}
      </div>
    );
  }
}
