import { Outlet, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Footer, Loading } from "./components";
import { FindJobs, Companies, UserProfile, CompanyProfile, UploadJob, JobDetails, Auth, ViewUser, Applications, Applicants } from "./pages";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export function Layout() {
  const { user } = useSelector(state => state.user);
  const location = useLocation()

  const pathMap = {
    '': 'Home',
    'find-jobs': 'Find a Job',
    'companies': 'Companies',
    'user-profile': 'User Profile',
    'company-profile': 'Company Profile',
    'upload-job': 'Upload a Job',
    'job-details': 'Job Details',
    'user-auth': 'Auth',
    'view-user': 'View User',
    'applications': 'Applications',
    'applicants': 'Applicants'
  };

  useEffect(() => {
    const pathParts = location.pathname.substring(1).split('/');
    const pageTitle = pathParts.map(part => pathMap[part] || part).filter(Boolean).join(' - ');
    document.title = pageTitle ? `Jobify - ${pageTitle}` : 'Jobify';
  }, [location]);

  // console.log(user)
  return user?.token ? (<Outlet />) : (<Navigate to='/user-auth' state={{ from: location }} replace />)
}

const NotFound = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/find-jobs")
  }, [])
  return null
}

function App() {
  const { user } = useSelector(state => state.user)
  
  return (
    <>
      <main className='bg-[#f7fdfd]'>
      <Navbar />
      
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Navigate to='/find-jobs' replace={true} />} />

            <Route path='/find-jobs' element={<FindJobs />} />
            <Route path='/companies' element={<Companies />} />
            <Route path={user?.accountType === "seeker" ? "/user-profile" : "/find-jobs"} element={<UserProfile />} />
            {user?.accountType !== "seeker" && <Route path="/view-user/:id" element={<ViewUser />} />}
            <Route path='/company-profile' element={<CompanyProfile />} />
            <Route path='/company-profile/:id' element={<CompanyProfile />} />
            <Route path='/upload-job' element={<UploadJob />} />
            <Route path='/job-details/:id' element={<JobDetails />} />
            <Route path='/applications' element={<Applications />} />
            <Route path='/applicants/:id' element={<Applicants />} />
            <Route path='/loading' element={<Loading containerStyle='h-[700px] flex items-center justify-center' />} />
            <Route path='*' element={<NotFound />} />
          </Route>
          <Route path='/user-auth' element={<Auth />} />
        </Routes>
        {user && <Footer />}
      </main>
    </>
  )
}

export default App
