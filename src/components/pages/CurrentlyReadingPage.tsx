import { useState, useEffect } from 'react';
import '../styles/homePage.css'
import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBook,
    faBuilding,
    faEuroSign,
    faPenToSquare,
    faRightLeft,
    faTrash,
    faUser
} from "@fortawesome/free-solid-svg-icons";

interface Book {
    id: number;
    coverImage?: string;
    title: string;
    author: string;
    publisher: string;
    pages: number;
    cost: number;
    readingStatus: string;
    reviewRating?: number;
    started: Date;
    finished: Date;
    notes?: string;
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const CurrentlyReadingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookCount, setBookCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    // Fetch books from backend with pagination
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const backendPage = currentPage - 1;
                const response = await fetch(
                    `http://localhost:8080/api/books/status/currently_reading?page=${backendPage}&size=${booksPerPage}&search=${encodeURIComponent(debouncedSearchTerm)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    }
                );

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Failed to fetch books');
                }

                const data: PageResponse<Book> = await response.json();
                setBooks(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                setBookCount(data.totalElements);
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
                setTotalPages(0);
                setTotalElements(0);
                setBookCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [currentPage, debouncedSearchTerm, booksPerPage]);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const handleDelete = async (bookId: number) => {
        if(window.confirm('Are you sure you want to delete this book?')) {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                // Delete book
                await fetch(`http://localhost:8080/api/books/${bookId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                // Refresh books
                const backendPage = currentPage - 1;
                const response = await fetch(
                    `http://localhost:8080/api/books/status/currently_reading?page=${backendPage}&size=${booksPerPage}&search=${encodeURIComponent(debouncedSearchTerm)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    }
                );

                const data: PageResponse<Book> = await response.json();
                setBooks(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                setBookCount(data.totalElements);

            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Error deleting book. Please try again.');
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="h-48 md:h-56 lg:h-64 relative overflow-hidden flex-shrink-0">
                <img
                    src="/image/pexels-rednguyen-10819256.jpg"
                    alt="Bookshelf Header"
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Return option */}
            <div className="absolute left-4 top-1/3 -translate-y-1/2">
                <Link to="/home_page">
                    <div className="relative group">
                        <FontAwesomeIcon icon={faRightLeft}
                                         className="text-yellow-600 text-2xl cursor-pointer hover:text-yellow-700 transition"
                        />
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                            Return back
                        </span>
                    </div>
                </Link>
            </div>

            {/* Main Content  */}
            <div className="flex-grow bg-amber-50 p-1">
                <div className="max-w-7xl mx-auto">
                    <div className="border-2 border-none p-4 md:p-6 lg:p-8 rounded-lg h-full">
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-yellow-600 text-center">
                                Currently reading
                            </h1>
                            <h1 className="text-xl md:text-2xl font-bold text-yellow-500 text-center mt-2">
                                Books: {bookCount}
                            </h1>

                            {/* SEARCH BAR */}
                            <div className="max-w-md mx-auto mt-4 md:mt-6">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="🔍 Search by title, author or publisher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                                />
                            </div>
                        </div>

                        {/* Books Grid  */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                            {books.length === 0 ? (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-amber-800 text-lg">
                                        {searchTerm ? `No books found for "${searchTerm}"` : "No books in your 'currently reading' category yet."}
                                    </p>
                                </div>
                            ) : (
                                books.map(book => (
                                    <div key={book.id} className="bg-white p-3 md:p-4 rounded-lg shadow-md border-3 border-amber-100">

                                        {/* Title */}
                                        <div className="mb-3">
                                            <h3 className="text-xl font-bold text-yellow-500 text-center">
                                                {book.title}
                                            </h3>
                                        </div>
                                        {book.coverImage && (
                                            <div className="mb-3 flex justify-center">
                                                <img
                                                    src={book.coverImage}
                                                    alt={`Cover of ${book.title}`}
                                                    className="w-28 h-40 md:w-32 md:h-48 object-cover rounded-lg shadow-md"
                                                />
                                            </div>
                                        )}

                                        <h3 className="text-md md:text-lg font-bold text-amber-800 mb-2 line-clamp-2">{book.title}</h3>

                                        {/* Book Details */}
                                        <div className="space-y-1.5 text-sm">
                                            <p className="text-amber-700 flex gap-1 ">
                                                < span className="font-bold text-amber-900 flex gap-1 ">
                                                    <FontAwesomeIcon icon={faUser}
                                                                     className="text-amber-700 text-sm " />Author:</span>
                                                <span className="text-amber-600 ml-1 font-bold">{book.author}</span>
                                            </p>
                                            <p className="text-amber-700">

                                                <span className="font-bold text-amber-900">
                                                    <FontAwesomeIcon icon={faBuilding}
                                                                     className="text-amber-700 text-sm"/> Publisher:</span>
                                                <span className="text-amber-600 ml-1 font-bold">{book.publisher}</span>
                                            </p>
                                            <p className="text-amber-700 flex gap-1">
                                                <span className="font-bold text-amber-900 flex gap-1">
                                                    <FontAwesomeIcon icon={faBook}
                                                                     className="text-amber-700 text-sm " />Pages:</span>
                                                <span className="text-amber-600 ml-1 font-bold ">{book.pages}</span>
                                            </p>
                                            <p className="text-amber-700 flex gap-1">
                                                <span className="font-bold text-amber-900 flex gap-1">
                                                     <FontAwesomeIcon icon={faEuroSign}
                                                                      className="text-amber-700 text-sm " />Cost:</span>
                                                <span className="text-amber-600 ml-1 font-bold">{book.cost} €</span>
                                            </p>
                                            <p className="text-amber-700">
                                                <span className="font-bold text-amber-900">Status:</span>
                                                <span className={`ml-1 font-bold ${
                                                    book.readingStatus === 'finished' ? 'text-green-600' :
                                                        book.readingStatus === 'currently_reading' ? 'text-yellow-400' :
                                                            book.readingStatus === 'to_read' ? 'text-blue-600' :
                                                                'text-red-600'
                                                }`}>
                                                    {book.readingStatus}
                                                </span>
                                            </p>
                                        </div>
                                        {book.reviewRating !== undefined && book.reviewRating !== null && (
                                            <p className="text-amber-700 mt-2 text-sm">
                                                <span className="font-bold text-amber-900">Rating:</span>
                                                <span className="text-amber-600 ml-1">⭐{book.reviewRating}/5</span>
                                            </p>
                                        )}

                                        {/* Started & Finished με γραμμές */}
                                        {(book.started !== undefined && book.started !== null) ||
                                        (book.finished !== undefined && book.finished !== null) ? (
                                            <div className="mt-3 pt-3 border-t border-amber-200">
                                                <div className="flex items-center justify-between">
                                                    {/* Started */}
                                                    {book.started !== undefined && book.started !== null && (
                                                        <div className="text-center">
                                                            <div className="text-xs font-bold text-amber-900">STARTED</div>
                                                            <div className="text-sm font-semibold text-amber-700 mt-1">
                                                                {new Date(book.started).toLocaleDateString('el-GR', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Γραμμή/Βέλος */}
                                                    {(book.started && book.finished) && (
                                                        <div className="mx-2">
                                                            <div className="w-8 h-0.5 bg-amber-400"></div>
                                                            <div className="text-center text-amber-500 text-xs mt-1">→</div>
                                                        </div>
                                                    )}

                                                    {/* Finished */}
                                                    {book.finished !== undefined && book.finished !== null && (
                                                        <div className="text-center">
                                                            <div className="text-xs font-bold text-amber-900">FINISHED</div>
                                                            <div className="text-sm font-semibold text-green-700 mt-1">
                                                                {new Date(book.finished).toLocaleDateString('el-GR', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}


                                        {book.notes && (
                                            <div className="text-amber-700 mt-2 text-sm">
                                                <div className=" mt-3 pt-3 border-t border-amber-200"></div>
                                                <span className="text-amber-900 font-bold  text-sm">📝 NOTES</span>
                                                <div className="max-h-20 overflow-y-auto">
                                                    <span className="mt-2 text-amber-600 ml-1 block">{book.notes}</span>
                                                </div>
                                            </div>
                                        )}


                                        {/* Action Buttons */}
                                        <div className="mt-3">
                                            <div className="flex gap-4 md:gap-6 justify-center items-center">
                                                <Link to={`/edit/${book.id}`} className="relative group">
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        className="text-amber-800 text-xl md:text-2xl cursor-pointer hover:text-amber-900 transition"
                                                    />
                                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                                                        Edit
                                                    </span>
                                                </Link>

                                                <div className="relative group">
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="text-red-800 text-xl md:text-2xl cursor-pointer hover:text-amber-900 transition"
                                                        onClick={() => handleDelete(book.id)}
                                                    />
                                                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                                                        Delete
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* PAGINATION CONTROLS */}
                        {totalPages > 1 && (
                            <div className="flex flex-col items-center gap-4 mt-6 md:mt-8">
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                                            const pageNumber = i + 1;
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`px-3 py-1 rounded-lg ${
                                                        currentPage === pageNumber
                                                            ? 'bg-amber-600 text-white'
                                                            : 'bg-amber-200 text-amber-700 hover:bg-amber-300'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>

                                <p className="text-amber-600 text-sm md:text-base">
                                    Page {currentPage} of {totalPages} •
                                    Showing {books.length} of {totalElements} books
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer*/}
            <footer className="bg-emerald-950 text-amber-100 flex-shrink-0">
                <div className="max-w-7xl mx-auto py-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <p className="text-sm font-semibold">
                            © {new Date().getFullYear()} BookShelf - All Rights Reserved
                        </p>
                        <span className="text-amber-500">📖</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default CurrentlyReadingPage;