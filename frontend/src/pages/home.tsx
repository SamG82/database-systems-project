import "../../styles/home.css"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="main column-flex">
      <div className="main-content">
        <h1 className="title">Appointment Manager</h1>
        <div className="account-options column-flex">
          <div className="patient-options">
            <Link to={'/login'}>Log in</Link>
            <Link to={'/register'}>Register</Link>
          </div>
          <hr className="divider"></hr>
          <Link to="/admin-login" className="administrator-button">Administrator?</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
