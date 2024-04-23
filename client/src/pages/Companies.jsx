import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRequest, updateURL } from '../utils';
import { Header, ListBox, Loading, CompanyCard, CustomButton } from '../components';

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [loading, setLoading] = useState(false)

  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await fetchCompanies();
  };
  const handleShowMore = () => {};
  const fetchCompanies = async () => {
    setLoading(true);
    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: searchLocation,
      sort: sort,
      navigate: navigate,
      location: location,
    })

    try {
      const res = await apiRequest({
        url: newURL,
        method: "GET",
      })

      setNumPage(res?.numOfPage);
      setRecordsCount(res?.total);
      setData(res?.data); 
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  }, [page, sort]);

  return (
    <div className='w-full'>
      <Header 
        placeholder={"Search for companies"}
        title={"Search all companies"}
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}/>

        <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 bg-[#f7fdfd]'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
              Showing <span className='font-semibold'>{recordsCount}</span> companies available
            </p>

            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort by:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className='w-full flex flex-col gap-6'>
            {
              loading ? (<Loading containerStyle={"flex items-center justify-center mt-10"} />) : (
                data?.map((company, index) => (
                  <CompanyCard company={company} key={index} />
                ))
              )
            }

            <p className='text-sm text-right'>
              Showing {data?.length} records out of {recordsCount}
            </p>
          </div>

          {numPage > page && !loading && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton 
                onClick={handleShowMore}
                title='Load more'
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
    </div>
  )
}

export default Companies