import { useEffect } from 'react';
import './App.css';
import Board from './components/Board/Board'

function App() {
  useEffect(() => {
    document.title = "XadrUFF"
  }, [])
  return (
    <div>
      <img id='logo' src='images/logo.png' alt="XadrUFF"/>
      <div className='center'><Board/></div>
    </div>
  );
}

export default App;
