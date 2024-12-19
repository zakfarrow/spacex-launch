import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LaunchProvider } from "@/contexts/LaunchContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import LaunchSummaryModal from "@/components/LaunchSummaryModal";

function App() {
  return (
    <LaunchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="summary/:rocketId" element={<LaunchSummaryModal />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LaunchProvider>
  );
}

export default App;
