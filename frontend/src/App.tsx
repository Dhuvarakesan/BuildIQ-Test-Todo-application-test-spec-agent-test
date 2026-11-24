import AppShell from './components/AppShell';
import { useTodos } from './hooks/useTodos';

function App() {
  const todoState = useTodos();

  return <AppShell todoState={todoState} />;
}

export default App;
