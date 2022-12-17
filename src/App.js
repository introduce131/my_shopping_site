import React, { useEffect } from 'react';
import Home from './components/pages/Home';
import { fireStore } from './firebase';

function App() {
  useEffect(() => {
    console.log(fireStore);
  }, []);
  return (
    <div>
      <Home />
      {console.log(fireStore._databaseId.projectId)}
    </div>
  );
}

export default App;
