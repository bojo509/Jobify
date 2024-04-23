const CustomButton = ( { title, containerStyles, icon, type, onClick } ) => {
  return (
    <button onClick={onClick} type={type || "button"} className={`inline-flex items-center ${containerStyles}`}>
        {title}
        {icon && <div className='ml-2'>{icon}</div>}
    </button>
  )
}

export default CustomButton