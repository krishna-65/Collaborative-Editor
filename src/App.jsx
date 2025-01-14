import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import './App.css'
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

const App = () => {

  return (
      <>
        <div>
              <Toaster position='top-right' toastOptions={{
                success:{
                  theme:{
                    primary:'a4aed88'
                  }
                }
              }}>
              </Toaster>
        </div>
          <BrowserRouter>
            
                <Routes>
                      <Route  path="/" element={<Home />} />
                      <Route  path="/editor/:roomId" element={<EditorPage />} />
                  </Routes>
            
          </BrowserRouter>
      </>
  );
}

export default App;
