import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import { NoticesPage, GalleryPage, EventsPage, ContactPage } from './pages/Public.jsx';
import AdministrationPage from './pages/Administration.jsx';
import About from './pages/About.jsx';
import { SectionPage, InternshipPage, AwpPage, DownloadsPage, PolicyPage, SitemapPage, SearchPage } from './pages/Sections.jsx';
import Login from './pages/Login.jsx';
import StudentPortal from './pages/StudentPortal.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import { Protected } from './auth.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<Navigate to="/about/overview" replace />} />
        <Route path="about/:slug" element={<About />} />
        <Route path="section/administration/structure" element={<AdministrationPage />} />
        <Route path="section/:menu/:slug" element={<SectionPage />} />
        <Route path="internship" element={<InternshipPage />} />
        <Route path="awp" element={<AwpPage />} />
        <Route path="awp/:session" element={<AwpPage />} />
        <Route path="downloads" element={<DownloadsPage />} />
        <Route path="downloads/:cat" element={<DownloadsPage />} />
        <Route path="policy/:slug" element={<PolicyPage />} />
        <Route path="sitemap" element={<SitemapPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="student/login" element={<Login portal="student" />} />
        <Route path="staff/login" element={<Login portal="staff" />} />
        <Route path="student/*" element={<Protected roles={['student']} to="/student/login"><StudentPortal /></Protected>} />
      </Route>
      {/* Admin / staff area has its own shell (no public header) */}
      <Route path="admin/*" element={<Protected roles={['staff', 'admin']} to="/staff/login"><AdminPanel /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
