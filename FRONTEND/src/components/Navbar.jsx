import React, { useEffect } from 'react'
import SearchBar from './SearchBar'
import useAuthStore from '../store/authStore'

const Navbar = (props) => {

    const { isAuthenticated, user } = useAuthStore();
    // console.log(isAuthenticated)
    
    return (
        <>
            <div className="bg-white flex items-center justify-between drop-shadow-lg min-h-[80px] px-5">

                
                <span className='text-2xl font-medium text-black '>{props.title}</span>
                {
                    props.navbar && <SearchBar/>
                }

                

            </div>
        
        </>
    )
}

export default Navbar
