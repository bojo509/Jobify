import { useState, useEffect, Fragment } from "react"
import moment from "moment"
import { AiOutlineSafety } from "react-icons/ai"
import { useParams, Link } from "react-router-dom"
import { CustomButton, JobCard, Loading, TextInput } from "../components"
import { apiRequest } from "../utils"
import { useSelector } from "react-redux"
import { Dialog, Transition } from "@headlessui/react";

const ApplyForm = ({ open, setOpen, loading, styles, func, message }) => {
  const closeModal = () => setOpen(false);

  return (
    <>
      <Transition appear show={open ?? false} as={Fragment} >
        <Dialog as='div' className={`relative z-10`} onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${styles}`}>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-semibold leading-6 text-gray-900'
                  >
                    Are you sure you want to apply for this job?
                  </Dialog.Title>
                  <div className='w-full'>
                    If you have changed your mind you have to contact the company to delete it.
                  </div>

                  {message && <span role='alert' className='text-xs text-red-500 mt-0.5'>{message}</span>}

                  <div className='mt-4 flex gap-2'>
                    {
                      loading ? <Loading /> : (
                        <>
                          <CustomButton
                            onClick={func}
                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none w-1/2 '
                            title={"Apply"}
                          />
                          <CustomButton
                            onClick={closeModal}
                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none w-1/2 '
                            title={"Cancel"}
                          />
                        </>
                      )
                    }
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const DeleteForm = ({ open, setOpen, loading, styles, func, message }) => {
  const closeModal = () => setOpen(false);

  return (
    <>
      <Transition appear show={open ?? false} as={Fragment} >
        <Dialog as='div' className={`relative z-10`} onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${styles}`}>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-semibold leading-6 text-gray-900'
                  >
                    Are you sure you want to delete this job?
                  </Dialog.Title>
                  <div className='w-full'>
                    This action is irreversable!
                  </div>

                  {message && <span role='alert' className='text-xs text-red-500 mt-0.5'>{message}</span>}

                  <div className='mt-4 flex gap-2'>
                    {
                      loading ? <Loading /> : (
                        <>
                          <CustomButton
                            onClick={func}
                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none w-1/2 '
                            title={"Delete"}
                          />
                          <CustomButton
                            onClick={closeModal}
                            containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none w-1/2 '
                            title={"Cancel"}
                          />
                        </>
                      )
                    }
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const JobDetails = () => {
  const { id } = useParams()
  const { user } = useSelector((state) => state.user)
  const [job, setJob] = useState({})
  /* Button selection*/
  const [selected, setSelected] = useState('0')
  const [loading, setLoading] = useState(false)
  const [similarJobs, setSimilarJobs] = useState([])
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [applyMessage, setApplyMessage] = useState("")
  const [deleteMessage, setDeleteMessage] = useState("")
  const [applyLoading, setApplyLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  const handleDeletePost = async () => {
    try {
      setDeleteLoading(true)
      const res = await apiRequest({
        url: "/jobs/delete-job/" + id,
        token: user?.token,
        method: "DELETE"
      })

      if (res.status === "Succeeded") {
        setDeleteMessage("Job deleted successfully")
      }

      setTimeout(() => {
        window.location.replace("/company-profile")
      }, 2000);
      setDeleteLoading(false)
    }
    catch (error) {
      setDeleteLoading(false)
      console.log(error)
    }
  }

  const handleHasApplied = async () => {
    try {
      const res = await apiRequest({
        url: "/jobs/check-application/" + id,
        token: user?.token,
        method: "GET"
      })

      setHasApplied(res?.hasApplied)
    } catch (error) {
      console.log(error);
    }
  }

  const handleApplyToJob = async () => {
    try {
      setApplyLoading(true)
      const res = await apiRequest({
        url: "/jobs/apply/" + id,
        token: user?.token,
        method: "POST"
      })

      if (res.status === "Succeeded") {
        setApplyMessage("Application successful")
      }
      else {
        setErrorMessage(res.message)
      }

      setApplyLoading(false)
      setTimeout(() => {
        document.location.pathname = document.location.pathname;
      }, 2000);
    }
    catch (error) {
      setApplyLoading(false)
      console.log(error)
    }
  }

  const fetchJobInfo = async () => {
    setLoading(true)
    try {
      const res = await apiRequest({
        url: "/jobs/get-job-details/" + id,
        method: "GET"
      })

      setJob(res?.data)
      setSimilarJobs(res?.similarJobs)
      setLoading(false)
    }
    catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchJobInfo()
    handleHasApplied()
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [id])

  if (loading) {
    return <Loading containerStyle='h-[700px] flex items-center justify-center' />
  }

  return (
    <div className="container mx-auto px-5">
      <div className="w-full flex flex-col md:flex-row gap-10">
        <div className="w-full h-fit md:w-3/4 2xl:w-5/6 bg-white py-10 md:px-10 shadow-md">
          <div className="w-full flex items-center justify-between">
            <div className="w-3/4 flex gap-2">
              <img src={job?.company?.profileUrl} alt={job?.company?.name} className="w-20 h-20 md:w-24 md:h-24 rounded" />

              <div className="flex flex-col ml-5">
                <p className="text-xl text-gray-800 font-semibold">{job?.jobTitle}</p>

                <span className="text-base">{job?.location}</span>
                <span className="text-base">{job?.company?.name}</span>
                <span className="text-base">{moment(job?.createdAt).fromNow()}</span>
              </div>
            </div>
            <div>
              <AiOutlineSafety className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="w-full flex flex-wrap md:flex-row gap-5 items-center justify-between my-10">
            <div className="bg-[#1d4fd826] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-base">Salary: </span>
              <p className="text-lg font-semibold">{job?.salary} $</p>
            </div>

            <div className="bg-[#1d4fd826] w-40 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-base">Job type: </span>
              <p className="text-lg font-semibold">{job?.jobType}</p>
            </div>

            {job?.applicants?.length === 0 ? (
              <div className="bg-[#1d4fd826] w-44 h-16 rounded-lg flex flex-col items-center justify-center hover:shadow-outline hover:border-transparent hover:border-3 hover:border-blue-400">
                <span className="text-base">Number of applicants: </span>
                <p className="text-lg font-semibold">{job?.applicants?.length}</p>
              </div>
            ) :
              (
                user?._id === job?.company?._id ? (
                  <Link to={`/applicants/${id}`}>
                    <div className="bg-[#1d4fd826] w-44 h-16 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-base">Number of applicants: </span>
                      <p className="text-lg font-semibold">{job?.applicants?.length}</p>
                    </div>
                  </Link>) : (
                  <div className="bg-[#1d4fd826] w-44 h-16 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-base">Number of applicants: </span>
                    <p className="text-lg font-semibold">{job?.applicants?.length}</p>
                  </div>
                )
              )}

            <div className="bg-[#1d4fd826] w-44 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-base">Number of vacancies: </span>
              <p className="text-lg font-semibold">{job?.vacancies}</p>
            </div>

            <div className="w-full flex gap-4 py-5 ">
              <CustomButton
                onClick={() => setSelected("0")}
                title={"Job description"}
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${selected === "0" ? "bg-[#1d4ed8] text-white" : " bg-white text-black border border-blue-300"}`} />

              <CustomButton
                onClick={() => setSelected("1")}
                title={"Company information"}
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${selected === "1" ? "bg-[#1d4ed8] text-white" : " bg-white text-black border border-blue-300"}`} />
            </div>
          </div>

          <div className="my-6">
            {selected === "0" ? (
              <>
                <p className="text-xl font-semibold">
                  Job description
                </p>

                <span className="text-base">{job?.desc}</span>

                {
                  job?.requirements && (
                    <>
                      <p className="text-xl font-semibold mt-8">
                        Requirements
                      </p>

                      <span className="text-base">{job?.requirements}</span>
                    </>
                  )
                }
              </>
            ) : (
              <>
                <div className="mb-6 flex flex-col">
                  <p className="text-xl font-semibold">
                    {job?.company?.name}
                  </p>

                  <span className="text-base">{job?.company?.location}</span>
                  <span className="text-sm">{job?.company?.email}</span>
                </div>

                <p className="text-xl font-semibold">
                  About the company
                </p>

                <span>{job?.company?.about}</span>
              </>
            )}
          </div>

          <div className="w-full">
            {
              user?._id === job?.company?._id ?
                <CustomButton
                  onClick={() => setDeleteOpen(true)}
                  title={"Delete job post"}
                  containerStyles={"w-full flex items-center justify-center text-white bg-blue-700 py-3 px-5 outline-none rounded-full text-base"}
                />
                :
                user.accountType === undefined ? (<div className="w-full flex items-center justify-center text-white bg-blue-700 py-3 px-5 outline-none rounded-full text-base">You are a company, you can't apply to this job</div>) : (hasApplied ? (<div className="w-full flex items-center justify-center text-white bg-blue-700 py-3 px-5 outline-none rounded-full text-base">You have already applied for this job</div>) : (
                  <CustomButton
                    onClick={() => setOpen(true)}
                    title={"Apply now"}
                    containerStyles={"w-full flex items-center justify-center text-white bg-blue-700 py-3 px-5 outline-none rounded-full text-base"}
                  />))
            }

            <span role='alert' className='text-xs text-red-500 mt-0.5'>
              {errorMessage.desc?.message}
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/4 2xl:w-2/4 p-5 mt-20 md:mt-0">
          <p className="text-grey-500 font-semibold">
            Similar job posts
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {similarJobs?.slice(0, 3).map((job, index) => {
              const data = {
                name: job?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };
              return <JobCard job={data} key={index} />;
            })}
          </div>
        </div>
      </div>
      <ApplyForm open={open} setOpen={setOpen} loading={applyLoading} styles="mt-24" func={handleApplyToJob} message={applyMessage} />
      <DeleteForm open={deleteOpen} setOpen={setDeleteOpen} loading={deleteLoading} styles="mt-24" func={handleDeletePost} message={deleteMessage} />
    </div>
  )
}

export default JobDetails