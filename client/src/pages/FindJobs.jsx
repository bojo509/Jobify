import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CustomButton, Header, JobCard, Loading } from '../components'
import { BiBriefcaseAlt2 } from 'react-icons/bi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { BsStars } from 'react-icons/bs'
import { experience, jobTypes } from '../utils/data'
import { ListBox } from '../components/ListBox'
import { apiRequest, updateURL } from '../utils'

const FindJobs = () => {
  const [sort, setSort] = useState('Newest')
  const [page, setPage] = useState(1)
  const [numPage, setNumPage] = useState(1)
  const [recordCount, setRecordCount] = useState(0) //jobcount
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [filteredJobTypes, setFilteredJobTypes] = useState([])
  const [filterExp, setFilterExp] = useState([])
  const [expVal, setExpVal] = useState([])
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const filterJobs = (val) => {
    if (filteredJobTypes?.includes(val)) {
      setFilteredJobTypes(filteredJobTypes.filter((el) => el != val));
    } else {
      setFilteredJobTypes([...filteredJobTypes, val]);
    }
  };
  
  const filterExperience = async (e) => {
    if (expVal?.includes(e)) {
      setExpVal(expVal?.filter((el) => el != e));
    } else {
      setExpVal([...expVal, e]);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);

    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filteredJobTypes,
      exp: filterExp,
    });

    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      setData(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchJobs();
  }

  const handleShowMore = async (event) => {
    event.preventDefault();
    setPage(page + 1);
  }

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];

      expVal?.map((el) => {
        const newEl = el?.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });

      newExpVal?.sort((a, b) => a - b);

      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal?.length - 1]}`);
    }
  }, [expVal]);

  useEffect(() => {
    fetchJobs();
  }, [sort, filteredJobTypes, filterExp, page]);

  return (
    <div>
      <Header 
        placeholder="Search for jobs"
        title="Find your dream job with ease" 
        type="home" 
        handleClick={handleSearchSubmit} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        searchLocation={jobLocation}
        setSearchLocation={setJobLocation}
      />

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
        <div className='md:flex flex-col w-1/6 h-fit bg-white shadow-sm px-2 py-2 rounded-md'>
          <p className='text-lg font-semibold text-slate-600'>Filter search</p>

          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Job type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2'>
              {jobTypes.map((type, index) => (
                <div key={index} className='flex gap-2 text-sm md:text-base'>
                  <input type="checkbox" value={type} className='w-4 h-4' onChange={(e) => filterJobs(e.target.value)} />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Experience
              </p>
            </div>

            <div className='flex flex-col gap-2'>
                {experience.map((exp) => (
                  <div className='flex gap-3' key={exp.title}>
                    <input type="checkbox" value={exp.value} className='w-4 h-4' onChange={(e) => filterExperience(e.target.value)}  />
                    <span>{exp.title}</span>
                  </div>
                  ))}
              </div>
          </div>
        </div>

        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
                Showing <span className='font-semibold'>{recordCount}</span> jobs
            </p>

            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className='w-full flex flex-wrap gap-4'>
          {
            loading ? (<Loading containerStyle={'items-center justify-center'} />) : (data?.map((job, index) => {
              const newJob = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };

              return <JobCard job={newJob} key={index} />;
            }))
          }
          </div>

          {numPage > page && !loading && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton 
              onClick={handleShowMore}
                title="Load More" 
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindJobs