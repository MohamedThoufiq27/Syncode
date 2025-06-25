import { useState } from 'react'
// import { loginApi } from './service/firebaseLogin';
import { storeUserData } from './service/storage';
import { isAuth } from './service/auth';
import {  Link,Navigate } from 'react-router-dom';
import { signInUser, signInWithGoogle } from './service/firebaseConfig';


const Login = () => {
  const initialErrorState = {
      email:{required:false},
      password:{required:false},
      custom_error:null
  }
  const [errors,setErrors] =  useState(initialErrorState);
  const [loading,setLoading] = useState(false);
  const [redirectToEditor,setredirectToEditor] = useState(false);

  const [inputs,setInputs] = useState({
      email:"",
      password:"",
  })

  const handleSubmit = (e)=>{
    e.preventDefault();
    let errors = initialErrorState;
    let hasError = false;
   
    if(inputs.email==""){
      errors.email.required=true;
      hasError=true;
    }
    if(inputs.password==""){
      errors.password.required=true;
      hasError=true;
    }

    if(!hasError){
      setLoading(true);
      signInUser(inputs).then((res)=>{
        console.log(res);
        storeUserData(res._tokenResponse.idToken);
      }).catch((err)=>{
        console.log(err);
        if(String(err.message).includes('(auth/invalid-credential)')){
          setErrors({...errors,custom_error:'Invalid Credentials'});
        }
        if(String(err.message).includes('password should be atleast 6 characters')){
          setErrors({...errors,custom_error:'Password should be atleast 6 characters'});
        }
        
      }).finally(()=>{
        setLoading(false);
      })
    }

    setErrors({...errors});
  }

  const handleGoogleLogin = async () =>{
    signInWithGoogle().then((res)=>{
      console.log();
      storeUserData(res.user.accessToken);
      if(res.user){
        setredirectToEditor(true);
      }
    }).catch((err)=>{
      console.log(err.message)
    })
    // storeUserData(res.credential);
  }
 
  
  


  
  const handleInput = (e)=>{
    setInputs({...inputs,[e.target.name]:e.target.value})
  }

  if(redirectToEditor || isAuth()){
    return <Navigate to='/editor' />
  }

  return (
      <div className='flex justify-center items-center dark:bg-gray-900 bg-white w-screen h-screen'>
      <div className="relative group">
        <div
          className="absolute -inset-2 rounded-lg  bg-linear-to-br  from-purple-500 to-pink-500 opacity-40 blur-2xl group-hover:opacity-70 transition-opacity duration-300 ease-in"
        ></div>
        
        <div className="relative flex items-center justify-center border border-zinc-700 rounded-lg bg-zinc-900 text-slate-300">
          <div className="max-w-md w-100 dark:bg-zinc-900 bg-white rounded-xl shadow-lg p-8 ">
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                name='email'
                onChange={handleInput}
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="your@email.com"
              />
              {errors.email.required && <span className='text-red-500 text-sm'>Email is Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                name='password'
                onChange={handleInput}
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password.required && <span className='text-red-500 text-sm'>Password is Required</span>}
            </div>

            {errors.custom_error ? <span className='text-red-500 text-sm'>{errors.custom_error}</span>:null}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input  type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>

            <button onClick={handleSubmit} className="w-full bg-indigo-600 disabled:cursor-none hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors" disabled={loading}>
              {loading ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-zinc-900 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>:
              'Sign In'}
            </button>
          </form>

            {/* <div className='pt-2.5'>
             <GoogleLogin  onSuccess={handleGoogleLogin} onError={handleGoogleError} theme='filled_blue' shape='rectangular' />   
            </div> */}

          <button
            onClick={handleGoogleLogin}
            aria-label="Sign in with Google"
            className="mt-6  w-full flex items-center gap-3 bg-gray-800 rounded-lg py-1 transition-colors duration-300 hover:bg-gray-900  hover:border-gray-700"
          >

            <div className="w-full flex items-center justify-center bg-transparent h-9 rounded-l">
              <div className='px-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                  <title>Sign i with Google</title>
                  <desc>Google G Logo</desc>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    className="fill-blue-500"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    className="fill-green-500"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    className="fill-yellow-500"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    className="fill-red-500"
                  ></path>
                </svg>
              </div>
              <div className='px-1'>
                <span className="text-md text-white">Sign in with Google</span>
              </div>
            </div>
            
          </button>

          

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? 
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</Link>
          </div>
        </div>
        </div>
      </div> 
    </div>
      // <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        
        
      // </div>
  )
}

export default Login