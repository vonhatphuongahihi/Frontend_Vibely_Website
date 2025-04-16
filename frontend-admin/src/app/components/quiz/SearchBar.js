'use client'

import React from 'react'

const SearchBar = ({ onSearch }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const searchValue = e.target.search.value;
        onSearch(searchValue);
    };

    return (
        <form onSubmit={handleSubmit} className="w-96">
            <div className="relative">
                <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#086280] focus:border-transparent"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 text-white bg-[#086280] rounded-r-lg hover:bg-[#064d63] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </form>
    )
}

export default SearchBar 