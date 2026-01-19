import React from 'react' 

const Button = ({styles, onClick}) => {
  return(
    <button 
      type="button" 
      onClick={onClick}
      className={`py-4 px-6 bg-green-gradient
      font-poppins font-medium text-[18px] text-primary 
      outline-none ${styles} rounded-[10px] hover:scale-105 transition-transform cursor-pointer`}>
        Get Started
      </button>
  )
}

export default Button 
