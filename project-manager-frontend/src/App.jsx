
import './App.css'
import { Login } from './components/Login'
import { Dashboard } from './pages/dashboard'
import { Tasks } from './pages/Tasks'
import { Projects } from './pages/Projects'
import { Teams } from './pages/Teams'
import { ProtectedRoute } from './layouts/ProtectedRoute'
import { Route, Routes } from "react-router-dom"
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/projects" element={<Projects />} />
           <Route path="/tasks" element={<Tasks />}/>
           <Route path="/teams" element={<Teams />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
