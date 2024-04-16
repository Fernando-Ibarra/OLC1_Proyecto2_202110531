import { Route, Routes } from 'react-router-dom';
import { Home, Ast } from '../home'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ast" element={<Ast />} />
        </Routes>
    )
}
