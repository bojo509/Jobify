import { useState, useEffect } from 'react'
import { apiRequest } from '../utils'
import { useSelector } from 'react-redux'
import { JobCard, Loading } from '../components'

const Applications = () => {
    const { user } = useSelector(state => state.user)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const res = await apiRequest({
                method: 'GET',
                url: '/jobs/get-applications',
                token: user?.token
            })
            if (res.status === 'Succeeded') {
                setApplications(res.jobs)
                setLoading(false)
            }
            else {
                setError(res.message)
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchApplications()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, [])

    return (
        loading ? (<Loading containerStyle={'h-[700px] flex items-center justify-center'} />) : (
            <div className='container mx-auto flex-col gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='text-sm md:text-base ml-5'>
                        {applications.length === 1 ? <p>You have applied to <span className='font-semibold'>{applications.length}</span> job</p> : <p>You have applied to <span className='font-semibold'>{applications.length}</span> jobs</p> }
                    </div>
                </div>

                <div className='w-full px-5 md:px-0 flex flex-row flex-wrap gap-6'>
                    {applications.map((application, index) => (
                        <JobCard job={application} key={index} />
                    ))}
                </div>
            </div>)
    )
}

export default Applications