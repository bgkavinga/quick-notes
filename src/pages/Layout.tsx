import React, { ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FaHome, FaTags, FaCog } from 'react-icons/fa'
import Notification from '@/components/Notification'


type LayoutProps = {
  children?: ReactNode
}

const Layout: React.FC<LayoutProps> = () => {
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

  return (
    <div className='flex flex-grow layout'>
     <aside className='w-1/4 bg-gray-800 text-white p-4'>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold'>Quick Note</h2>
        </div>
        <nav>
          <ul className='space-y-2'>
            <li>
              <Link
                to='/'
                className={`flex items-center py-2 px-3 rounded-md transition-colors duration-200 ${
                  isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <FaHome className='mr-2' />
                Home
              </Link>
            </li>
            <li>
              <Link
                to='/tag-list'
                className={`flex items-center py-2 px-3 rounded-md transition-colors duration-200 ${
                  isActive('/tag-list') ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <FaTags className='mr-2' />
                Tags
              </Link>
            </li>
            <li>
              <Link
                to='/settings'
                className={`flex items-center py-2 px-3 rounded-md transition-colors duration-200 ${
                  isActive('/settings') ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <FaCog className='mr-2' />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className='w-3/4'>
        <Outlet />
      </main>
      <Notification />
    </div>
  )
}

export default Layout
