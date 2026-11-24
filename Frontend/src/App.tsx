
import {PortfolioContent} from "./page/PortfolioContent"
import NotFound from "./page/NotFound"
import AllProjectsPage from "./page/projects"
import { Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<PortfolioContent />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
