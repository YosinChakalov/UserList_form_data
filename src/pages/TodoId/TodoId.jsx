import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const TodoId = () => {
    let {id} = useParams()
    const [data, setData] = useState([])
    async function getId(id) {
        try {
            let {data} = await axios.get("http://65.108.148.136:8080/ToDo/get-to-do-by-id?id=" + id)
            setData(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        getId(id)
    },[])

  return (
    <div className='flex justify-center items-center h-[600px]'>
        <div className='m-auto border-2 p-[25px] rounded-[10px] shadow-xl'>
        {data.images?.map((el)=> {
            return (
            <img key={el.id} src={"http://65.108.148.136:8080/images/" + el.imageName} className='w-[280px]' />
            )
        })}
        <h1 className='text-[30px] my-[20px]'> Name: {data.name}</h1>
        <h1 className='text-[20px]'> Desciption: {data.description}</h1>
        </div>
    </div>
  )
}

export default TodoId