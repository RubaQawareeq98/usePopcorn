// function memoize(fn) {
//     let mem={}
//     let count=0
   
    
//     return function(...args) {
//        if(args.length===0) return count 
//         let val=JSON.stringify(args)
//         if(! (val in mem)){
//             mem[val]=fn(...args)
//             count++
//         }
        
//         return mem[val]
//     }
// }

// const sum = (a, b) => a + b;
// const memoizedSum = memoize(sum);

// console.log(memoizedSum(1,2))
// console.log(memoizedSum(1,5))
// console.log(memoizedSum(1,2))
// console.log(memoizedSum())


// async function sleep(millis) {
//     return new Promise((resolve)=>{
//         setTimeout(resolve,millis)
//     })
// }
// sleep(100)

var timeLimit = function(fn, t) {
    
	return async function(...args) {
        return new Promise(async (resolve, reject) => {
        setTimeout(()=>reject("Time Limit Exceeded"),t)
        try{
           let res= await fn(...args);
           resolve(res)
        }
        catch(error){
            reject(error)
        }
        })
    }
};
let fn = async (n) => { 
    await new Promise(res => setTimeout(res, 100)); 
    return n * n; 
  }
  let x=timeLimit(fn,50)
  x(5)