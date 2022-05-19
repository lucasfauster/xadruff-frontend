import './App.css';
import Board from './components/Board/Board'

function App() {
  return (
    <div id='app'>
      <img id='logo' src='images/logo.png' alt="XadrUFF"/>
      <div id='board-area'><Board/></div>
    </div>
  );
}

export default App;
