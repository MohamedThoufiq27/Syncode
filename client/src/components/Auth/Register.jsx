import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from './service/firebaseApi';
import { updateProfile } from 'firebase/auth';
import { useSharedData } from '../../hooks/useSharedData';
import { toast } from 'react-toastify';

const Register = () => {
  // isAuth is the single source of truth for authentication
  const { roomid, isAuth,setUserName } = useSharedData();
  const navigate = useNavigate();

  
  // This hook will run whenever 'isAuth' changes.
  // It handles all navigation away from this page.
  useEffect(() => {
    if (isAuth) {
      console.log("isAuth is true, navigating now...");
      if (roomid) {
        navigate(`/editor/${roomid}`);
      } else {
        navigate('/');
      }
    }
  }, [isAuth, navigate, roomid]); 

  const initialErrorState = {
    email: { required: false },
    password: { required: false },
    name: { required: false },
    custom_error: null,
  };

  const [errors, setErrors] = useState(initialErrorState);
  const [loading, setLoading] = useState(false);
  
  // We no longer need this state. isAuth handles it.
  // const [redirectToEditor, setredirectToEditor] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = { ...initialErrorState };
    let hasError = false;

    if (inputs.name === "") { newErrors.name.required = true; hasError = true; }
    if (inputs.email === "") { newErrors.email.required = true; hasError = true; }
    if (inputs.password === "") { newErrors.password.required = true; hasError = true; }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      const res = await createUser(inputs);
      const user = res.user;

      await updateProfile(user, {
        displayName: inputs.name
      });
      setUserName(inputs.name); // manually setting the username so that it immediately sets the name without being get from the firebase so that we can prevent the name to be set as null
      // The user is now created. The onAuthStateChanged listener in your
      // global context will automatically fire, setting isAuth = true.
      // The useEffect above will then handle the navigation.
      
      console.log("Registration successful for:", inputs.name);
      toast.success("Account created successfully!");

      // We no longer manually trigger navigation here.
      // setredirectToEditor(true);

    } catch (err) {
      let custom_error = 'An unknown error occurred.';
      if (String(err.message).includes('auth/email-already-in-use')) {
        custom_error = 'Account Already Exists. Please Login.';
      }
      setErrors({ ...newErrors, custom_error: custom_error });
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // We have removed the manual navigation block from here.
  // The component now only renders the JSX.

  return (
    <div className='flex justify-center items-center dark:bg-gray-900 bg-white w-screen h-screen'>
      <div className="relative group">
        <div
          className="absolute -inset-2 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 opacity-40 blur-2xl group-hover:opacity-70 transition-opacity duration-300 ease-in"
        ></div>
        
        <div className="relative flex items-center justify-center border border-zinc-700 rounded-xl bg-zinc-900 text-slate-300 hover:peer-first:opacity-55">
          <div className="max-w-md w-100 dark:bg-zinc-900 bg-white rounded-xl shadow-lg p-8 ">
            <h2 className="text-2xl font-bold dark:text-white text-black mb-6 text-center">Register / Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  onChange={handleInput}
                  name='name'
                  type='text' 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Enter Your Name"
                />
                {errors.name.required && <span className='text-red-500 text-sm'>Name is Required</span>}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  onChange={handleInput}
                  name='email'
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="your@email.com"
                />
                {errors.email.required && <span className='text-red-500 text-sm'>Email is Required</span>}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  onChange={handleInput}
                  name='password'
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                {errors.password.required && <span className='text-red-500 text-sm'>Password is Required</span>}
              </div>
              
              {errors.custom_error && <span className='text-red-500 text-sm'>{errors.custom_error}</span>}
              
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition-colors" disabled={loading}>
                {loading ? (
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-zinc-900 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                  </svg> 
                ) : 'Sign Up'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account? 
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign In</Link>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Register;