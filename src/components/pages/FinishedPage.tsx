import { useState, useEffect } from 'react';
import '../styles/homePage.css'
import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRightLeft, faTrash} from "@fortawesome/free-solid-svg-icons";


// Ορισμός interface για τα βιβλία
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



const FinishedPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookCount, setBookCount] = useState(0);

    useEffect(() => {
        fetch('http://localhost:8080/api/books/count')
            .then(res => res.json())
            .then(count => setBookCount(count))
    }, []);

    const handleDelete = async (bookId:number) => {
        if(window.confirm('Are you sure?')) {
            try {

                await fetch(`http://localhost:8080/api/books/${bookId}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Backend delete failed, using frontend delete:', error);
            } finally {

                setBooks(books.filter(book => book.id !== bookId));
            }
        }
    }

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // FETCH books με status = 'finished'
    useEffect(() => {

        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/books/status/finished');
                if (response.ok) {
                    const booksData = await response.json();
                    setBooks(booksData);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
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
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-amber-800 flex items-center justify-center px-4 relative">
                            <span className="text-center">Finished</span>
                        </h1>
                        <h1 className="text-2xl font-bold text-amber-600 flex items-center justify-center px-4 relative">
                            <span className="text-center p-1">Books: {bookCount}</span>
                        </h1>

                        {/* SEARCH BAR  */}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {filteredBooks.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-amber-800 text-lg">
                                    {searchTerm ? `No finished books found for "${searchTerm}"` : "No finished books yet."}
                                </p>
                            </div>
                        ) : (
                            filteredBooks.map(book => (
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
                                        <span className="ml-1 text-green-600 font-semibold">
                                            {book.readingStatus}
                                        </span>
                                    </p>
                                    {book.reviewRating !== undefined && book.reviewRating !== null && (
                                        <p className="text-amber-600"><span className="font-semibold">Rating:</span> ⭐{book.reviewRating}/5</p>
                                    )}
                                    {book.notes && (
                                        <p className="text-amber-600 mt-2"><span className="font-semibold">Notes:</span> {book.notes}</p>
                                    )}

                                    {/* 2 ΚΟΥΜΠΙΑ */}
                                    <div className="mt-4">
                                        <div className="flex gap-6 justify-center items-center">
                                            {/* Edit Button */}
                                            <Link to="/edit" className="relative group">
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

export default FinishedPage;