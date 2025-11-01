import logo from './assets/anh-ech-meme.jpg';
import './App.css';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
        </header>
      </div>
    </MainLayout>
  );
}

export default App;
