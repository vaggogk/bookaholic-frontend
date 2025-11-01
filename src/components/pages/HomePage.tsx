import '../styles/homePage.css'
import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {


    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="h-64 relative overflow-hidden flex-shrink-0">
                <img
                    src="/image/pexels-rednguyen-10819256.jpg"
                    alt="Bookshelf Header"
                    className="w-full h-full object-cover"
                />
            </div>




            {/* Main Content */}
            <div className="flex-grow bg-amber-50 p-4">
                <div className="border-2 border-none p-8 rounded-lg h-full">
                    <form className="h-full">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-amber-800 flex items-center justify-center px-4 relative">
                                <span className="text-center">Bookshelf</span>

                                {/* Add book - */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Link to="/add_book">
                                        <div className="relative group">
                                            <FontAwesomeIcon
                                                icon={faCirclePlus}
                                                className="text-amber-800 text-2xl cursor-pointer hover:text-amber-900 transition"
                                            />
                                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                                                Add Book
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Logout */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Link to="/log_out">
                                    <div className="relative group">
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className="text-amber-800 text-2xl cursor-pointer hover:text-amber-900 transition"
                                        />
                                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                                            Logout
                                        </span>
                                    </div>
                                    </Link>
                                </div>
                            </h1>

                        </div>

                        {/* Main Navigation Grid */}
                        <div className="flex w-full flex-col sm:flex-row gap-4">
                            <Link to="/library" className="flex-1">
                                <div className="bg-gradient-to-br from-green-100 to-amber-800 border-2 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:border-none min-w-0 h-full">
                                    <div className="font-bold text-white w-full h-full py-27 flex items-center justify-center text-lg">
                                        📚 Library
                                    </div>
                                </div>
                            </Link>

                            <Link to="/currently_reading" className="flex-1">
                                <div className="bg-gradient-to-br from-amber-800 to-green-100 border-2 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:border-none min-w-0 h-full">
                                    <div className="font-bold text-amber-50 w-full h-full py-27 flex items-center justify-center text-lg">
                                        <span className="text-3xl mb-2">📖 </span>
                                        Currently Reading
                                    </div>
                                </div>
                            </Link>

                            <Link to="/to_read" className="flex-1">
                                <div className="bg-gradient-to-br from-green-100 to-amber-800 border-2 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:border-none min-w-0 h-full">
                                    <div className="font-bold text-white w-full h-full py-27 flex items-center justify-center text-lg">
                                        📋 To Read
                                    </div>
                                </div>
                            </Link>

                            <Link to="/finished" className="flex-1">
                                <div className="bg-gradient-to-br from-amber-800 to-green-100 border-2 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer hover:scale-105 hover:border-none min-w-0 h-full">
                                    <div className="font-bold text-white w-full h-full py-27 flex items-center justify-center text-lg">
                                        🏆 Finished
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer*/}
            <footer className="bg-emerald-950 text-amber-100 flex-shrink-0">
                <div className="container mx-auto py-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-amber-700"></span>
                        <p className="text-a font-semibold">
                            © {new Date().getFullYear()} BookShelf - All Rights Reserved
                        </p>
                        <span className="text-amber-600">📖</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage;