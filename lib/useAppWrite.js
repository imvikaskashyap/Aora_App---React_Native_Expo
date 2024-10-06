import { useEffect, useState } from "react"

const useAppWrite = (fn)=>{
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
  
    const fetchData = async()=>{
      try {

        const res = await fn()

        setData(res)
        
      } catch (error) {
        Alert.alert(error.message)
      }finally{
        setIsLoading(false)
      }
    }
    useEffect(()=>{
  
      fetchData()
    },[])

    const reFetch = ()=> fetchData()
  
    return {data, isLoading, reFetch}
}

export default useAppWrite