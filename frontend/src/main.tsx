import React from "react"
import ReactDOM from "react-dom/client"
import "../styles/index.css"

import Router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main>
      <Router/>
    </main>
  </React.StrictMode>,
)
