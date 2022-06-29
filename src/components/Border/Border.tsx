import './Border.css';

interface Props{
    text: string;
    axis: string;
}

export default function Border({text, axis}: Props){
    switch ( axis ) {
        case 'V':
            return  <div data-testid="test-vertical" className="border border-vertical">
                        <div >
                            {text.toUpperCase()}
                        </div>
                    </div>
        case 'H':
            return  <div data-testid="test-horizontal" className="border border-horizontal">
                        <div >
                            {text.toUpperCase()}
                        </div>
                    </div>
        case 'C':
            return  <div data-testid="test-corner" className="border border-corner">
                        <div >
                            {text}
                        </div>
                    </div>
        default: 
            return null
     }
}