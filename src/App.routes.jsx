import { Routes, Route } from 'react-router-dom'
import NotFound from './components/utils/NotFound.jsx'
import Unauthorized from './components/utils/Unauthorized.jsx'
import Login from "./components/users/auth/Login.jsx"
import ResetPassword from './components/users/auth/ResetPassword.jsx'
import VerifyCode from './components/users/auth/VerifyCode.jsx'
import CompleteReset from './components/users/auth/CompleteReset.jsx'
import AccessUser from './middlewares/access_user.jsx'
import AccessAdmin from './middlewares/access_admin.jsx'
import Dashboard from "./components/Dashboard.jsx"
import Home from './components/Home.jsx'
import Users from './components/users/Users.jsx'
import Subjects from './components/subjects/Subjects.jsx'
import Aspects from './components/aspects/Aspects.jsx'
import LegalBasis from './components/legalBasis/LegalBasis.jsx'
import Requirements from './components/requirements/Requirements.jsx'
import RequirementTypes from './components/requirementTypes/RequirementTypes.jsx'
import LegalVerbs from './components/legalVerbs/LegalVerbs.jsx'
import Articles from './components/articles/Articles.jsx'

/**
 * Application routing component.
 * Defines and renders all routes and their associated components, including protected routes.
 * 
 * @component
 * @returns {JSX.Element} The routing configuration for the application.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/request" element={<ResetPassword />} />
      <Route path="/reset-password/verify" element={<VerifyCode />} />
      <Route path="/reset-password/complete" element={<CompleteReset />} />

      {/* Protected user routes */}
      <Route element={<AccessUser element={<Dashboard />} />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<AccessAdmin element={<Users />} />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:id/aspects" element={<Aspects />} />
        <Route path="/legal_basis" element={<LegalBasis />} />
        <Route path="/legal_basis/:id/articles" element={<Articles />} />
        <Route path='/requirements' element={<Requirements />} />
        <Route path='/requirement_types' element={<RequirementTypes />} />
        <Route path='/legal_verbs' element={<LegalVerbs/>} />
      </Route>

      {/* Error and Unauthorized routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
