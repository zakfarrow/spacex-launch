import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Summary from '@/pages/Summary';
import NotFound from '@/pages/NotFound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/summary'
					element={<Summary />}
				/>
				<Route
					path='*'
					element={<NotFound />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
