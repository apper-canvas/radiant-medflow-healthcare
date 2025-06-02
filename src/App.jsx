import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
function App() {
  return (
<div className="App min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/20 to-secondary-50/20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
        toastClassName="bg-white shadow-medical border border-surface-200 rounded-xl"
        progressClassName="bg-gradient-to-r from-primary-500 to-secondary-500"
      />
    </div>
  )
}

export default App