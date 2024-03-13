
import { useEffect, useRef, useState } from 'react';
import './App.css';
import StarRating from './starRating.js'
import { useKey } from './useKeys';
import { useLocalStorage } from './useLocalStorage';
import { useMovies } from './useMovies';
export default function App() {
 

const[query,setQuery]=useState('')
const[selectedId,setSelectedId]=useState(null)
const {movies,isLoading,error}= useMovies(query)

const[watched,setWatched]=useLocalStorage([],"watched")


function handelSelectID(id){
  setSelectedId((selectedId)=>selectedId===id?null:id)
}
function handelAddWatch(movie){
  setWatched(watched=>[...watched,movie])

 
}






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
  const input= useRef(null)
  

useKey("Enter",function(){
  if(document.activeElement === input.current){
    return
  }
  input.current.focus()
  setQuery("")
})

  // useEffect(function(){
  //   document.querySelector('.ser').focus()
  // },[query])

  return <div className='search'>
   <h1>🍿 usePopcorn</h1> 
   <input className='ser' type={'text'} placeholder="Search movies..."  
   value={query}
   onChange={(e)=>setQuery(e.target.value)}
   ref={input}
   ></input>
   
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

const countRef=useRef(0)

useEffect(function(){

  if(userRating)
  countRef.current++
},[userRating])
 


const{Title:title,
      Year:year,
      Poster:poster,
      Runtime:runtime,
      imdbRating,
      Plot:plot,
      Released: released,
      Actor:actors,
      Director:director,
      Genre:genre,
}=movie


// const[isTop,setIsTop]=useState(imdbRating>7)
// useEffect(
//   function() {
//   setIsTop(imdbRating>7)
// },[imdbRating])
// console.log(isTop)

const isTop =imdbRating>7
console.log(isTop)

const[avgRating,setAvg]=useState(0)


const exist= watched.map(movie=>movie.imdbID).includes(selectedId);
function handelAdd(){
 
  const newMovie={
    imdbID:selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime:Number(runtime.split(' ').at(0)),
    userRating,
    countRatin: countRef.current

  }


  
  onAddWatched(newMovie)

// setAvg(Number(imdbRating))
// setAvg(avgRating=>(avgRating+userRating)/2)


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

  useKey("Escape",handelSelectID,selectedId)

 
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

      <p>{avgRating}</p>

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