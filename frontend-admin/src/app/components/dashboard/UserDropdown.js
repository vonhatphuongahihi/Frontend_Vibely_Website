'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiSettings, FiUser, FiLogOut } from 'react-icons/fi'

const UserDropdown = ({ userName = "Như Quỳnh", userEmail = "ngonhuquynh@gmail.com", avatarSrc = "/images/dashboard/quynh1.jpg" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center focus:outline-none" 
        onClick={toggleDropdown}
      >
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white">
          <Image 
            src={avatarSrc} 
            alt="User Avatar" 
            width={40} 
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-200">
            <p className="font-medium text-gray-900">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link href="/admin/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <FiSettings className="mr-3 text-gray-500" />
              <span>Settings</span>
            </Link>
            <Link href="/admin/account" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
              <FiUser className="mr-3 text-gray-500" />
              <span>Profile</span>
            </Link>
            <button 
              onClick={() => console.log('Sign out')} 
              className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="mr-3 text-gray-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDropdown 