import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { apiRequest } from "../utils"
import { Loading } from "../components"
import { GoLocation } from 'react-icons/go'
import { Link } from "react-router-dom"
import "../css/custom.css"

export const UserCard = ({ applicant }) => {
    return (
        <Link to={`/view-user/${applicant?._id}`}>
            <div className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                  rounded-md px-5 py-5'>
                <div className='w-full h-full flex flex-col justify-center'>
                    <div className='flex gap-3'>
                        <img src={applicant?.profileUrl} alt={applicant?.firstName} className='size-14' />
                        <div>
                            <p className='font-semibold text-lg'>{applicant?.jobTitle}</p>
                            <span className='flex gap-2 items-center'>
                                <GoLocation className='text-slate-900 text-sm' />
                                <p>{applicant?.location}</p>
                            </span>
                        </div>
                    </div>

                    <div>
                        <p>
                            {applicant?.about?.length > 150 ? applicant?.about?.slice(0, 150) + '...' : applicant?.about}
                        </p>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
                            {applicant?.contact}
                        </p>

                    </div>
                </div>
            </div>
        </Link>
    )
}

const Applicants = () => {
    const { id } = useParams()
    const { user } = useSelector((state) => state.user)
    const [applicants, setApplicants] = useState([])
    const [loading, setLoading] = useState(false)
    const handleFetchApplicants = async () => {
        try {
            setLoading(true)
            const res = await apiRequest({
                url: '/jobs/get-applicants/' + id,
                method: 'GET',
                token: user?.token
            })
            setApplicants(res?.applicants)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    useEffect(() => {
        handleFetchApplicants()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, [])

    return (
        loading ? (<Loading containerStyle={'h-[700px] flex items-center justify-center'} />) : (
            <div className='container mx-auto flex flex-col gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='text-sm md:text-base'>
                        {applicants.length === 1 ? <p>There is <span className='font-semibold'>{applicants.length}</span> applicant for this job</p> : <p>There are <span className='font-semibold'>{applicants.length}</span> applicants for this job</p>}
                    </div>
                </div>

                <div className='w-full md:w-5/6 px-5 md:px-0 flex flex-row gap-6 custom-width'>
                    {
                        applicants.map((applicant, index) =>
                            <UserCard applicant={applicant} key={index} />
                        )
                    }
                </div>
        </div>)
    )
}

export default Applicants