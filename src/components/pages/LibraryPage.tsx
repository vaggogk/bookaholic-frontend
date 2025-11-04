import { useState, useEffect } from 'react';
import '../styles/homePage.css'
import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRightLeft, faTrash} from "@fortawesome/free-solid-svg-icons";

interface Book {
    id: number;
    imageUrl?: string;
    title: string;
    author: string;
    publisher: string;
    pages: number;
    cost: number;
    readingStatus: string;
    reviewRating?: number;
    notes?: string;
}

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

const LibraryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookCount, setBookCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // 1-based indexing
    const [booksPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);



    // Fetch books from backend with pagination
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                // Convert to 0-based for backend
                const token = localStorage.getItem('authToken');
                const backendPage = currentPage - 1;

                const response = await fetch(
                    `http://localhost:8080/api/books?page=${backendPage}&size=${booksPerPage}&search=${encodeURIComponent(searchTerm)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );


                if (!response.ok) {
                    throw new Error('Backend not available');
                }

                const data: PageResponse<Book> = await response.json();
                setBooks(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } catch (error) {
                console.error('Error fetching books:', error);
                // No fallback - just show empty state
                setBooks([]);
                setTotalPages(0);
                setTotalElements(0);
            } finally {
                setLoading(false);
            }
        };



        fetchBooks();
    }, [currentPage, searchTerm, booksPerPage]);

    // Fetch total count for the header
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(
                    `http://localhost:8080/api/books/count?search=${encodeURIComponent(searchTerm)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.ok) {
                    const count = await response.json();
                    setBookCount(count);
                }
            } catch (error) {
                console.error('Error fetching count:', error);
                setBookCount(0);
            }
        };

        fetchCount();
    }, [searchTerm]);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleDelete = async (bookId: number) => {
        if(window.confirm('Are you sure you want to delete this book?')){
            try {
                const token = localStorage.getItem('authToken');
                await fetch(`http://localhost:8080/api/books/${bookId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Refresh the current page after deletion
                const backendPage = currentPage - 1;
                const response = await fetch(
                    `http://localhost:8080/api/books?page=${backendPage}&size=${booksPerPage}&search=${encodeURIComponent(searchTerm)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const data: PageResponse<Book> = await response.json();
                setBooks(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);

                // Also refresh count
                const countResponse = await fetch('http://localhost:8080/api/books/count',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                if (countResponse.ok) {
                    const count = await countResponse.json();
                    setBookCount(count);
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Error deleting book. Please try again.');
            }
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

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

            {/* Return option */}
            <div className="absolute left-4 top-1/3 -translate-y-1/2">
                <Link to="/home_page">
                    <div className="relative group">
                        <FontAwesomeIcon icon={faRightLeft}
                                         className="text-amber-800 text-2xl cursor-pointer hover:text-amber-900 transition"
                        />
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                            Return back
                        </span>
                    </div>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-amber-50 p-4">
                <div className="border-2 border-none p-8 rounded-lg h-full">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-amber-800 flex items-center justify-center px-4 relative">
                            <span className="text-center">Library</span>
                        </h1>
                        <h1 className="text-2xl font-bold text-green-800 flex items-center justify-center px-4 relative">
                            <span className="text-center p-1">Books: {bookCount}</span>
                        </h1>

                        {/* SEARCH BAR */}
                        <div className="max-w-md mx-auto mt-6">
                            <input
                                type="text"
                                placeholder="🔍 Search by title, author or publisher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-amber-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                            />
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {books.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-amber-800 text-lg">
                                    {searchTerm ? `No books found for "${searchTerm}"` : "No books in your library yet."}
                                </p>
                            </div>
                        ) : (
                            books.map(book => (
                                <div key={book.id} className="bg-white p-4 rounded-lg shadow-md border-3 border-amber-100">
                                    {book.imageUrl && (
                                        <div className="mb-4 flex justify-center">
                                            <img
                                                src={book.imageUrl}
                                                alt={`Cover of ${book.title}`}
                                                className="w-32 h-48 object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-amber-800 mb-2">{book.title}</h3>
                                    <p className="text-amber-600"><span className="font-semibold">Author:</span> {book.author}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Publisher:</span> {book.publisher}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Pages:</span> {book.pages}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Cost:</span> €{book.cost}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Status:</span>
                                        <span className={`ml-1 ${
                                            book.readingStatus === 'finished' ? 'text-green-800' :
                                                book.readingStatus === 'currently_reading' ? 'text-yellow-800' :
                                                    book.readingStatus === 'to_read' ? 'text-blue-800' :
                                                    'text-pink-800'
                                        }`}>
                                            {book.readingStatus}
                                        </span>
                                    </p>
                                    {book.reviewRating !== undefined && book.reviewRating !== null && (
                                        <p className="text-amber-600"><span className="font-semibold">Rating:</span> ⭐{book.reviewRating}/5</p>
                                    )}

                                    {book.notes && (
                                        <p className="text-amber-600 mt-2"><span className="font-semibold">Notes:</span> {book.notes}</p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-4">
                                        <div className="flex gap-6 justify-center items-center">
                                            {/* Edit Button */}
                                            <Link to={`/edit/${book.id}`} className="relative group">
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    className="text-amber-800 text-2xl cursor-pointer hover:text-amber-900 transition"
                                                />
                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                                                    Edit
                                                </span>
                                            </Link>

                                            {/* Delete Button */}
                                            <div className="relative group">
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-red-800 text-2xl cursor-pointer hover:text-amber-900 transition"
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
                        <div className="flex flex-col items-center gap-4 mt-8">
                            {/* Pagination buttons */}
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

                            {/* Page info */}
                            <p className="text-amber-600">
                                Page {currentPage} of {totalPages} •
                                Showing {books.length} of {totalElements} books
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer*/}
            <footer className="bg-emerald-950 text-amber-100 flex-shrink-0">
                <div className="container mx-auto py-6 text-center">
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

export default LibraryPage;