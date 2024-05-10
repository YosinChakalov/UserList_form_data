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
    <div>
        <h1>{id}</h1>
        {data.images?.map((el)=> {
            return (
            <img key={el.id} src={"http://65.108.148.136:8080/images/" + el.imageName} className='w-[280px]' />
            )
        })}
        <h1 className='text-[50px]'>{data.name}</h1>
        <h1 className='text-[50px]'>{data.description}</h1>
    </div>
  )
}

export default TodoId