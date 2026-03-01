import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Escrow from './pages/Escrow';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/escrow" element={<Escrow />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
