import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PatientManagement from './pages/PatientManagement'
import Appointments from './pages/Appointments'
import Billing from './pages/Billing'
import Emergency from './pages/Emergency'
import LabResults from './pages/LabResults'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/billing" element={<Billing />} />
<Route path="/emergency" element={<Emergency />} />
        <Route path="/lab-results" element={<LabResults />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
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