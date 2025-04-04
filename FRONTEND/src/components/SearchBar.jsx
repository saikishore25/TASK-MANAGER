import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
    
    const {register,handleSubmit, watch, reset, formState:{errors, isSubmitted, isSubmitting}} = useForm();
    const [searchQuery, setSearchQuery] = useState("")

    const onSubmit = (data)=>{

        console.log(data);

    }
    return (
        <>

            <div className="search-bar ">

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="search-area cursor-pointer bg-slate-100 flex flex-row border-black border-1  rounded-sm h-10 w-80 p-2 items-center justify-between    ">

                        <input type="text" className='outline-none bg-slate-100 w-[90%]' placeholder='Search Your Notes' {...register("search")} value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
                        {
                            searchQuery ? <FaSearch className='text-black'/> : <FaSearch className='text-gray-400'/>

                        }
                        

                    </div>


                </form>
            </div>
        
        </>
    )
}

export default SearchBar
