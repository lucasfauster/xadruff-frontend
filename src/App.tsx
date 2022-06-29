import { useEffect } from 'react';
import './App.css';
import Menu from './components/Menu/Menu'
import Board from './components/Board/Board'

function App() {
  useEffect(() => {
    document.title = "XadrUFF"
  }, [])
  return (
    <div>
      <div data-testid="test-app" className='center'><Menu/></div>
    </div>
  );
}

export default App;
