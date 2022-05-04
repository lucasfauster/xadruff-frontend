import './App.css';
import Board from './components/Board'

function App() {
  return (
    <div id='app'>
      <img id='logo' src={require('./images/logo.png')} alt="XadrUFF"/>
      <div id='board-area'><Board/></div>
    </div>
  );
}

export default App;
