import { Routes, Route, BrowserRouter } from 'react-router-dom';

import BasicPhotoAlbumPage from './pages/BasicPhotoAlbumPage';
import FontPage from './pages/FontPage';
import LoginPage from './pages/LoginPage';
import PhotoAlbumPage from './pages/PhotoAlbumPage';
import WriteLetterPage from './pages/WriteLetterPage';
import CalendarPage from './pages/CalendarPage';
import MainWithLoading from './pages/MainWithLoading';
import LetterStoragePage from './pages/LetterStoragePage';
import EnterPage from './pages/EnterPage';
import JoinPage from './pages/JoinPage';
import CreateGroupPage from './pages/CreateGroupPage';
import Header from './components/header/Header';

// 관리자 페이지
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div className='font-pretendard font-normal min-w-80'>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* 메인 페이지로 이동 전에 Loading 페이지 보임 */}
          <Route index path='/' element={<MainWithLoading />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/font' element={<FontPage />} />
          <Route path='/letter' element={<WriteLetterPage />} />
          <Route path='/album/basic' element={<BasicPhotoAlbumPage />} />
          <Route path='/album' element={<PhotoAlbumPage />} />
          <Route path='/album/:id' element={<PhotoAlbumPage />} />
          <Route path='/storage' element={<LetterStoragePage />} />
          <Route path='/calendar' element={<CalendarPage />} />
          <Route path='/enter' element={<EnterPage />} />
          <Route path='/join' element={<JoinPage />} />
          <Route path='/create' element={<CreateGroupPage />} />
          <Route path='/admin' element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;