import { useState } from 'react'
import { confirmUserPasswordReset } from './service/firebaseApi'
import { Link, Navigate, useSearchParams } from 'react-router-dom';


const PasswordReset = () => {
    const initialErrorState = {
          code:{required:false},
          password:{required:false},
          custom_error:null
      }
    const [errors,setErrors] =  useState(initialErrorState);
    const [loading,setLoading] = useState(false);
    const [redirectToLogin,setredirectToLogin] = useState(false);
    const [searchParams] = useSearchParams();

    const [inputs,setInputs] = useState({
        oobCode: searchParams.get('oobCode'),
        newpassword: ''
    });

    const handleConfirmation = () => {
        setLoading(true);
        let errors = initialErrorState;
        let hasError = false;
        if(inputs.newpassword==""){
            errors.password.required=true;
            hasError=true;
        }
        if(inputs.oobCode==""){
            errors.code.required=true;
            hasError=true;
        }   


        if(!hasError){
            setLoading(true);
            confirmUserPasswordReset(inputs.oobCode,inputs.newpassword).then((res)=>{
                console.log(res);
                setredirectToLogin(true);
            }).catch((err)=>{
                console.log(err);
                if(String(err.message).includes('(auth/invalid-action-code)')){
                    setErrors({...errors,custom_error:'Invalid Reset Code'});
                }
                if(String(err.message).includes('(auth/weak-password)')){
                    setErrors({...errors,custom_error:'Password should be atleast 6 characters'});
                }
            }).finally(()=>{
                setLoading(false);
            })
        }

        setErrors({...errors});
    }

    const handleInput = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    if(redirectToLogin){
        return <Navigate to="/login" replace={true}/>
    }

  return (
    <div className='flex justify-center items-center dark:bg-gray-900 bg-white w-screen h-screen'>
      <div className="relative group">
        <div
          className="absolute -inset-2 rounded-lg  bg-linear-to-br  from-purple-500 to-pink-500 opacity-40 blur-2xl group-hover:opacity-70 transition-opacity duration-300 ease-in"
        ></div>
        
        <div className="relative flex items-center justify-center border border-zinc-700 rounded-lg bg-zinc-900 text-slate-300">
          <div className="max-w-md w-100 dark:bg-zinc-900 bg-white rounded-xl shadow-lg p-8 ">
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h2>

          <p className="text-sm text-gray-600 mb-4 text-center">
             The reset code sent to your email 
          </p>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter the Reset Code</label>
              <input 
                name='oobCode'
                onChange={handleInput}
                value={inputs.oobCode} // Extracting oobCode from URL
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter Reset Code"
              />
              {errors.code.required && <span className='text-red-500 text-sm'>Code is Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                name='newpassword'
                onChange={handleInput}
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password.required && <span className='text-red-500 text-sm'>Password is Required</span>}
            </div>

            {errors.custom_error ? <span className='text-red-500 text-sm'>{errors.custom_error}</span>:null}

            

            <button onClick={handleConfirmation} className="w-full bg-indigo-600 disabled:cursor-none hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors" disabled={loading}>
              {loading ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-zinc-900 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>:
              'Reset Password'}
            </button>
          </form>

            {/* <div className='pt-2.5'>
             <GoogleLogin  onSuccess={handleGoogleLogin} onError={handleGoogleError} theme='filled_blue' shape='rectangular' />   
            </div> */}

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? 
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</Link>
          </div>
        </div>
        </div>
      </div> 
    </div>
  )
}

export default PasswordReset