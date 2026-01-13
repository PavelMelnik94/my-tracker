import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Meals } from './pages/Meals';
import { Supplements } from './pages/Supplements';
import { Wellbeing } from './pages/Wellbeing';
import { Recipes } from './pages/Recipes';
import { Analytics } from './pages/Analytics';
import { BottomNav } from './shared/components/BottomNav';

function App() {
  return (
    <Router basename="/my-tracker">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/supplements" element={<Supplements />} />
          <Route path="/wellbeing" element={<Wellbeing />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
