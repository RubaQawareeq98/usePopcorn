import { useEffect,useState } from "react"
export function useMovies(query){

const [movies,setMovies]=useState([])
const[isLoading,setIsLoading]=useState(false)
const[error,setError]=useState("")

    useEffect(function(){

        const controller=new AbortController();
      
       async function fetchData(){
        setIsLoading(true)
        setError('')
        let apiKey="fc39aa88"
        try{
          let res=await fetch(`http://www.omdbapi.com/?apikey=${apiKey} &s=${query}`,
          {signal:controller.signal}
          )
          if(!res.ok) throw new Error("There is a problem")
      
          
          let data=await res.json()
          if(data.Response==="False") throw new Error("Movie not found")
          setMovies(data.Search)
          setError('')
        }
        catch(error){
          setError(error.message)
          if(error.name!=='AbortError'){
            setError(error.message)
          }
          
        }
        finally{
          setIsLoading(false)
          
        }
      
        if(query.length<3){
          setError("")
          setMovies([])
          return;
        }
      
      
        }
      
        fetchData()
        // callback(selectedId)
        return function(){
          controller.abort()
        }
      },[query])

      return {movies,isLoading,error}

}