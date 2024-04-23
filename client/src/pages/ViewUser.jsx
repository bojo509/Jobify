import { useState, useEffect } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils";
import { Loading } from "../components";

const ViewUser = () => {
    const { id } = useParams();
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const fetchUserInfo = async () => {
        try {
            setLoading(true)
            const res = await apiRequest({
                url: "/users/get-user/" + id,
                method: "GET",
            })
            setInfo(res)
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserInfo()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, [id])

    return (
        loading ? (<Loading containerStyle={'h-[700px] flex items-center justify-center'} />) : (
            <div className='container mx-auto flex items-center justify-center py-10 px-5'>
            <div className='w-full md:w-2/3 2xl:w-2/4 bg-white shadow-lg p-10 pb-20 rounded-lg'>
                <div className='flex flex-col items-center justify-center mb-4'>
                    <h1 className='text-4xl font-semibold text-slate-600'>
                        {info?.firstName + " " + info?.lastName}
                    </h1>

                    <h5 className='text-blue-700 text-base font-bold'>
                        {info?.jobTitle || "Add Job Title"}
                    </h5>

                    <div className='w-full flex flex-wrap lg:flex-row justify-between mt-8 text-sm'>
                        <p className='flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full'>
                            <HiLocationMarker /> {info?.location ?? "No Location"}
                        </p>
                        <p className='flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full'>
                            <AiOutlineMail /> {info?.email ?? "No Email"}
                        </p>
                        <p className='flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full'>
                            <FiPhoneCall /> {info?.contact ?? "No Contact"}
                        </p>
                    </div>
                </div>

                <hr />

                <div className='w-full py-10'>
                    <div className='w-full flex flex-col-reverse md:flex-row gap-8 py-6'>
                        <div className='w-full md:w-2/3 flex flex-col gap-3 text-lg text-slate-700 mt-20 md:mt-0'>
                            <p className='font-semibold text-2xl'>About user</p>
                            <span className='text-base text-justify leading-7'>
                                {info?.about ?? "No About Found"}
                            </span>

                            <p className='font-semibold text-2xl'>User cv</p>
                            <span className='text-base text-justify leading-7'>
                                {info?.cvUrl ? <a href={info?.cvUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View CV</a> : "No CV uploaded"}
                            </span>
                        </div>

                        <div className='w-full md:w-1/3 h-44'>
                            <img
                                src={info?.profileUrl}
                                alt={info?.firstName}
                                className='w-full h-48 object-contain rounded-lg'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    );
};

export default ViewUser;