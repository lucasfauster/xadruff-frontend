import './Tile.css';

interface Props{
    image: string;
    color: number
}

export default function Tile({color, image}: Props){

    if(color % 2 === 0) {
        return <div className='tile dark-tile'><img src={image}></img></div>
    } else {
        return <div className='tile light-tile'><img src={image}></img></div>
    }
}