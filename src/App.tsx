import React from 'react';
import './App.css';
import {Program} from "react-tea-cup";
import * as Demo from './Demo';

function App() {
  return (
      <Program init={Demo.init} view={Demo.view} update={Demo.update} subscriptions={Demo.subscriptions}/>
  );
}

export default App;
