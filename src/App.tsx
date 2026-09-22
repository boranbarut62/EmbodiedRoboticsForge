import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { Learn } from './pages/Learn';
import { Practice } from './pages/Practice';
import { Progress } from './pages/Progress';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
