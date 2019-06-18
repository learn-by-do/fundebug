import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Demo from './views/Demo'
import Replay from './views/Replay';

function App() {
  return (
    <Router>
      <div>
        <ul className="nav">
          <li>
            <Link to="/demo">Demo</Link>
          </li>
          <li>
            <Link to="/replay">Replay</Link>
          </li>
        </ul>
        <em>
          move mouse, click anywhere, then click Item - 44 to trigger an
          error, then click <strong>Replay</strong> link.
        </em>
      </div>
      <hr />
      <Route path="/demo" component={Demo} />
      <Route path="/replay" component={Replay} />
    </Router>
  );
}

export default App;
