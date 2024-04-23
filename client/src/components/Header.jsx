import React from 'react'
import { AiOutlineSearch, AiOutlineCloseCircle } from 'react-icons/ai'
import { CiLocationOn } from 'react-icons/ci'
import CustomButton from './CustomButton'
import { popularSearch } from '../utils/data'


const SearchInput = ({ placeholder, icon, value, setValue, styles }) => {
  return (
    <div className={`flex w-full md:w-1/3 items-center ${styles}`}>
      {icon}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type='text'
        className='w-full md:w-64 p-2 outline-none bg-transparent text-base'
        placeholder={placeholder}
      />

      <AiOutlineCloseCircle
        className='hidden md:flex text-gray-600 text-xl cursor-pointer'
        onClick={() => { setValue('') }}
      />
    </div>
  )
}

const Header = ({ title, type, handleClick, searchQuery, setSearchQuery, searchLocation, setSearchLocation, placeholder }) => {
  return (
    <div className='bg-[#f7fdfd]'>
      <div className={`container mx-auto px-5 ${type ? "h-[500px]" : "h-[350px]"} flex items-center relative`}>
        <div className='w-full x-10'>
          <div className='mb-8'>
            <p className='text-slate-700 font-bold text-4xl'>{title}</p>
          </div>
          <div className='w-full flex items-center justify-around bg-white px-2 md:px-5 py-5 md:py-6 shadow-2xl rounded-full'>
            <SearchInput
              placeholder={placeholder}
              icon={<AiOutlineSearch className='text-gray-600 text-xl' />}
              value={searchQuery}
              setValue={setSearchQuery}
            />

            <SearchInput
              placeholder="Add country or city"
              icon={<CiLocationOn className='text-gray-800 text-xl' />}
              value={searchLocation}
              setValue={setSearchLocation}
              // styles='hidden md:flex'
            />

            <div className=''>
              <CustomButton
                onClick={handleClick}
                title="Search"
                containerStyles={"text-white py-2 md:py-3 px-3 md:px-10 focus:outline-none bg-blue-600 rounded-full md:rounded-md text-sm  md:text-base"}
              />
            </div>
          </div>

          {type && (
            <div className='w-full lg:1/2 flex flex-wrap gap-3 md:gap-6 py-10 md:py-14'>
              {popularSearch.map((search, index) => (
                <span key={index} className='bg-[#1d4fd826] text-[#1d4ed8] py-1 px-2 rounded-full text-sm md:text-base'>
                  {search}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header