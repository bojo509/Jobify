import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import "../css/custom.css"

const CompanyCard = ({ company }) => {
  const { user } = useSelector((state) => state.user)
  
  return (
    <div className='w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded md:h-16'>
      <div className='w-3/4 md:w-2/4 flex gap-4 items-center'>
        <Link to={user._id === company._id ? `/company-profile`: `/company-profile/${company?._id}`}>
          <img
            src={company?.profileUrl}
            alt={company?.name}
            className='ml-5 size-8 md:size-12 rounded'
          />
        </Link>
        <div className='h-full flex flex-col'>
          <Link
            to={user._id === company._id ? `/company-profile`: `/company-profile/${company?._id}`}
            className='text-base md:text-lg font-semibold truncate'
          >
            {company?.name}
          </Link>
          <span className='text-sm text-blue-600'>{company?.email}</span>
        </div>
      </div>

      <div className='w-1/4 h-full md:flex items-center justify-center'>
        <p className='text-base text-start custom'>{company?.location}</p>
      </div>
    </div>
  )
}

export default CompanyCard