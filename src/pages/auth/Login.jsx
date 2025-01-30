import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log(data)
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user_id', data.user.id)
        localStorage.setItem('username', data.user.username)
        localStorage.setItem('email', data.user.email)
        localStorage.setItem('first_name', data.user.first_name)
        localStorage.setItem('last_name', data.user.last_name)
        
        alert(t('login.success'))
        navigate('/')
      } else {
        const errorMessage = data.detail || data.message || t('login.error')
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || t('login.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-0 bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen" style={{ backgroundImage: 'url(/images/login.jpg)' }}>
        <div className="hidden bg-cover lg:block lg:w-2/3 bg-gray-900 bg-opacity-40">
          <div className="flex items-center h-full px-20">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('login.title')}</h2>
              <p className="max-w-xl mt-3 text-gray-300">{t('login.description')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center relative top-8 w-full px-6 mx-2 sm:mx-5 my-10 rounded max-w-lg bg-white bg-opacity-80">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
              </div>
              <p className="mt-3 text-gray-500 dark:text-gray-300">{t('login.signin_access')}</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    {t('login.username')}
                  </label>
                  <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={t('login.username_placeholder')}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" 
                    required
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">
                      {t('login.password')}
                    </label>
                    <a href="#" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">
                      {t('login.forgot_password')}
                    </a>
                  </div>
                  <div className="flex items-center">

                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    id="password" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('login.password_placeholder')}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" 
                    required
                  />
                  <button type="button" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                  >
                    {isLoading ? t('login.signing_in') : t('login.signin_button')}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                {t('login.no_account')} {' '}
                <a href="/register" className="text-blue-500 focus:outline-none focus:underline hover:underline">
                  {t('login.sign_up')}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login