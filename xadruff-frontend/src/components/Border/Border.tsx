import './Border.css';

interface Props{
    text: string;
    axis: string;
}

export default function Border({text, axis}: Props){
    if(axis === 'V') {
        return  <div className="border border-vertical">
                    <div >
                        {text.toUpperCase()}
                    </div>
                </div>
    } else if (axis === 'H') {
        return   <div className="border border-horizontal">
                    <div >
                        {text.toUpperCase()}
                    </div>
                </div>
    } else if (axis === 'C') {
        return   <div className="border border-corner">
                    <div >
                        {text}
                    </div>
                </div>
    } else {
        return null
    };
}