import { FC } from 'react'

const Search: FC = () => {
    return (
        <div className="flex ml-16">
            <input
                className="w-full py-11 px-14 text-body-2 border rounded-l-8 border-shadow-b text-black-c"
                type="text"
                placeholder="Поиск"
            />
            <button
                type="button"
                className="bg-brand-a1 rounded-r-8 text-body-2 capitalize text-black-a py-12 px-14"
            >
                найти
            </button>
        </div>
    )
}

export default Search
