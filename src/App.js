import React from 'react';
import Navbar from './components/navbar/navbar';
import Router from './router/router';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Footer from './components/Footer/footer';
// import Home from './pages/Home/home';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Home /> */}
      <Router />
      <Footer />

    </div>
  );
}

export default App;
