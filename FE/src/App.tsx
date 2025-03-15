import { Routes, Route, BrowserRouter } from 'react-router-dom';

import MainPage from './pages/MainPage';
import BasicPhotoAlbumPage from './pages/BasicPhotoAlbumPage';
import FontPage from './pages/FontPage';
import LoginPage from './pages/LoginPage';
import PhotoAlbumPage from './pages/PhotoAlbumPage';
import WriteLetterPage from './pages/WriteLetterPage';
import Modal from './components/common/Modal';

function App() {
  return (
    <div className='font-pretendard font-normal'>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/font' element={<FontPage />} />
          <Route path='/letter' element={<WriteLetterPage />} />
          <Route path='/album/basic' element={<BasicPhotoAlbumPage />} />
          <Route path='/album' element={<PhotoAlbumPage />} />
        </Routes>
      </BrowserRouter>
      <Modal />
    </div>
  );
}

export default App;
