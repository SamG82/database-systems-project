import "../styles/home.css"

function Home() {
  return (
    <div className="main">
      <div className="main-content">
        <h1 className="title">Appointment Manager</h1>
        <div className="account-options">
          <div className="patient-options">
            <button>Log in</button>
            <button>Sign up</button>
          </div>
          <hr className="divider"></hr>
          <button className="administrator-button">Administrator?</button>
        </div>
      </div>
    </div>
  )
}

export default Home
