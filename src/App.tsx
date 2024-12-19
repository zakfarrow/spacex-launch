import { BrowserRouter, Routes, Route } from "react-router-dom";
import LaunchProvider from "@/contexts/LaunchProvider";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import LaunchSummaryModal from "@/components/LaunchSummaryModal";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LaunchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route
                path="summary/:rocketId"
                element={<LaunchSummaryModal />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LaunchProvider>
    </ThemeProvider>
  );
}

export default App;
