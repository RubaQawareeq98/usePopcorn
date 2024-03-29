
import { useEffect, useState } from 'react';
import './App.css';
import StarRating from './starRating.js'
export default function App() {
 
const [movies,setMovies]=useState([])
const [watched,setWatched]=useState([])
const[isLoading,setIsLoading]=useState(false)
const[error,setError]=useState("")
const[query,setQuery]=useState('')
const[selectedId,setSelectedId]=useState(null)

function handelSelectID(id){
  setSelectedId((selectedId)=>selectedId===id?null:id)
}
function handelAddWatch(movie){
  setWatched(watched=>[...watched,movie])
}


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
  handelSelectID(selectedId)
  return function(){
    controller.abort()
  }
},[query])



  return (
    <div className="App">
      
      <div className='search'>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </div>

      <div className='mov'>
        {error && <ErrorMessage message={error}/>}
      {isLoading&&<Loading/>}
     {!isLoading && !error && <Movies handelSelectID={handelSelectID} movies={movies} /> }
        {selectedId?<SelectedMovie 
        watched={watched}
        onAddWatched={handelAddWatch}
        selectedId={selectedId} handelSelectID={handelSelectID}/>:<Watched movies={watched} setWatched={setWatched}/>}
      </div>


    </div>
  );
}

function Loading(){
  return <div className='loading'>
    <p>Loading...</p>
  </div>
}

function ErrorMessage({message}){
  return <p>⛔{message}</p>
}

function Search({query, setQuery}){
  

  return <div className='search'>
   <h1>🍿 usePopcorn</h1> 
   <input type={'text'} placeholder="Search movies..."  
   value={query}
   onChange={(e)=>setQuery(e.target.value)}></input>
   
  </div>
}

function NumResults({movies}){
  return <p>Found {movies.length} top results</p>
}

function Movies({movies,handelSelectID}){
  const[isOpen,setIsOpen]=useState(true)
  
  function handelOpen(){
    setIsOpen(o=>!o)
  }
  return <>
  <div className='all'>
  <span className='a' onClick={handelOpen}>{isOpen?'-':'+'}</span>
    {isOpen&&<div className='list'>
    {movies.map(movie=> <Movie id={movie.imdbID} title={movie.Title} year={movie.Year} poster={movie.Poster} handelSelectID={handelSelectID} />)}
    </div>}
  </div>
  </>
}

function Watched({movies,setWatched}){
  const[isOpen,setIsOpen]=useState(true)

  function handelOpen(){
    setIsOpen(o=>!o)
  }

  return <>
  <div className='watched'>
    
    <div className='card'>
      <h3>Movies you have watched before</h3>
      <div className='rate'>
      <span>#️⃣{0} movies</span>
      <span>⭐{0.0}</span>
      <span>🌟{0.0}</span>
      <span>⏳{0.0}</span>
      </div>
   
   
   
    </div>
      <span className='w' onClick={handelOpen}>{isOpen?'-':'+'}</span>


   {isOpen && <div className='list'>
    
   {movies.map(movie=> <WatchedMovie movie={movie} watched={movies} setWatched={setWatched} />)}
    
    </div>}
  </div>
  </>
}

function SelectedMovie({selectedId,handelSelectID, onAddWatched,watched}){
const[movie,setMovie]=useState({})
const[isLoading,setIsLoading]=useState(false)
const[userRating,setUserRating]=useState('')

const{Title:title,
      Year:year,
      Poster:poster,
      Runtime:runtime,
      imdbRating,
      Plot:plot,
      Released: released,
      Actor:actors,
      Director:director,
      Genre:genre
}=movie



const exist= watched.map(movie=>movie.imdbID).includes(selectedId);
function handelAdd(){
 
  const newMovie={
    imdbID:selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime:Number(runtime.split(' ').at(0)),
    userRating

  }
  
  onAddWatched(newMovie)
  handelSelectID(selectedId)
}

  useEffect(function(){
      async function getMovie(){
        setIsLoading(true)
        let res=await fetch(`http://www.omdbapi.com/?apikey=f84fc31d&i=${selectedId}`)
        let data = await res.json()
        setMovie(data)
        setIsLoading(false)
      }
      getMovie()
  },[selectedId])


  useEffect(function(){
    if(!title) return
    document.title= title
    return function(){
      document.title= "usePopcorn"
      
  }
  }
  ,[title])



  useEffect(function(){
    function callback(e){
        if(e.code==='Escape'){
          handelSelectID(selectedId)
        }
      }
      document.addEventListener('keydown',callback)
      return function(){
        document.removeEventListener('keydown',callback)
      };
    
  },[handelSelectID])

return<div className='details'>
 {isLoading?<Loading/>: <>
<header>
<button className='back' onClick={()=>handelSelectID(selectedId)}>⬅</button>
<img src={poster}></img>



    <div className='StarRating'>
      <h2>{title}</h2>
      <p>{released} &bull; {runtime} onSetRating={setUserRating}</p>
      <p>⭐ {imdbRating} IMDb Rating</p>
      </div>
      </header>
     {!exist?
      <div className='rating'>
      <StarRating  maxRating={10} size={20} setUserRating={setUserRating}/> 
      <button onClick={(e)=>handelAdd(e)}>+ Add to list</button>
        {console.log("rate: "+movie.userRating)}

      </div>:<p>You have rate this movie before</p>}
      <section>
        <p>{plot}</p>
        <p>Staring {actors}</p>
      </section>
       
</>}
</div>
}


function Movie({poster,title,year,handelSelectID,id}){
return <div className='cardm' onClick={()=>handelSelectID(id)}>
  <img src={poster}></img>
  <div>
  <h3>{title}</h3>
  <p>📅{year}</p>

  </div>
</div>
}


function WatchedMovie({movie, watched,setWatched}){

  function handelDelete(){
    let updated=watched.filter(mov=>mov.imdbID!=movie.imdbID)
    setWatched(updated)
  }
  return <div className='cardm'>
  <img src={movie.poster}></img>
  <div>
  <h3>{movie.title}</h3>
  
      <div className='rate'>
        <span>⭐{movie.imdbRating}</span>
        <span>🌟{movie.userRating}</span>
        <span>⏳{movie.runtime}</span>
      </div>
    <button className='del' onClick={handelDelete}>❌</button>
  </div>
</div>
}