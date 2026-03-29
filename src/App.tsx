import { Outlet } from 'react-router';

import Header from './components/Header';

const App = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default App;
