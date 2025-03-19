import { Routes, Route, BrowserRouter } from 'react-router-dom';

import BasicPhotoAlbumPage from './pages/BasicPhotoAlbumPage';
import FontPage from './pages/FontPage';
import LoginPage from './pages/LoginPage';
import PhotoAlbumPage from './pages/PhotoAlbumPage';
import WriteLetterPage from './pages/WriteLetterPage';
import Modal from './components/common/Modal/Modal';
import MainWithLoading from './pages/MainWithLoading';
import LetterStoragePage from './pages/LetterStoragePage';

function App() {
  return (
    <div className='font-pretendard font-normal min-w-80'>
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지로 이동 전에 Loading 페이지 보임 */}
          <Route index path='/' element={<MainWithLoading />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/font' element={<FontPage />} />
          <Route path='/letter' element={<WriteLetterPage />} />
          <Route path='/album/basic' element={<BasicPhotoAlbumPage />} />
          <Route path='/album/:id' element={<PhotoAlbumPage />} />
          <Route path='/storage' element={<LetterStoragePage />} />
        </Routes>
      </BrowserRouter>
      <Modal />
    </div>
  );
}

export default App;