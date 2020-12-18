import React from 'react';
import './App.scss';
import {DevTools, Program} from "react-tea-cup";
import * as Demo from './Demo';

function App() {
  return (
      <Program
          init={Demo.init}
          view={Demo.view}
          update={Demo.update}
          subscriptions={Demo.subscriptions}
          devTools={DevTools.init<Demo.Model, Demo.Msg>(window)}
      />
  );
}

export default App;
