import { GoLocation } from 'react-icons/go'
import moment from 'moment'
import { Link } from 'react-router-dom'

const JobCard = ({ job }) => {
  return (
    <Link to={`/job-details/${job?._id}`}>
        <div className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md px-5 py-5'>
            <div className='w-full h-full flex flex-col justify-center'>
                <div className='flex gap-3'>
                    <img src={job?.logo || job?.company.profileUrl} alt={job?.company?.name} className='size-14' />
                    <div>
                        <p className='font-semibold text-lg'>{job?.jobTitle}</p>
                        <span className='flex gap-2 items-center'> 
                            <GoLocation className='text-slate-900 text-sm' />
                            <p>{job?.location}</p>
                        </span>
                    </div>
                </div>

                <div>
                    <p>
                        {job?.desc?.length > 150 ? job?.desc?.slice(0, 150) + '...' : job?.desc}
                    </p>
                </div>

                <div className='flex items-center justify-between'>
                    <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
                        {job?.jobType}
                    </p>
                    <p className='text-sm text-slate-600'>
                        {moment(job?.createdAt).fromNow()}
                    </p>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default JobCard