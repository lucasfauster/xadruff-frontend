import './Border.css';

interface Props{
    text: string;
    axis: string;
}

export default function Border({text, axis}: Props){
    switch ( axis ) {
        case 'V':
            return  <div className="border border-vertical">
                        <div >
                            {text.toUpperCase()}
                        </div>
                    </div>
        case 'H':
            return  <div className="border border-horizontal">
                        <div >
                            {text.toUpperCase()}
                        </div>
                    </div>
        case 'C':
            return  <div className="border border-corner">
                        <div >
                            {text}
                        </div>
                    </div>
        default: 
            return null
     }
}