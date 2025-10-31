import { useState, useEffect } from 'react';
import '../styles/homePage.css'
import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightLeft} from "@fortawesome/free-solid-svg-icons";

interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    pages: number;
    cost: number;
    readingStatus: string;
    reviewRating?: number;
    notes?: string;
}

const LibraryPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // MOCK DATA
        const mockBooks: Book[] = [
            {
                id: 1,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                publisher: "Scribner",
                pages: 180,
                cost: 12.99,
                readingStatus: "finished",
                reviewRating: 4.5,
                notes: "Classic novel about the American Dream"
            },
            {
                id: 2,
                title: "1984",
                author: "George Orwell",
                publisher: "Secker & Warburg",
                pages: 328,
                cost: 0,
                readingStatus: "currently_reading",
                reviewRating: 4.8,
                notes: "Dystopian social science fiction"
            },
            {
                id: 3,
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                publisher: "George Allen & Unwin",
                pages: 310,
                cost: 15.75,
                readingStatus: "to_read",
                reviewRating: 0,
                notes: "Fantasy adventure novel"
            }
        ];

        setBooks(mockBooks);
        setLoading(false);

        /*
        //
        try {
            const response = await fetch('http://localhost:8080/api/books');
            if (response.ok) {
                const booksData = await response.json();
                setBooks(booksData);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
        */
    }, []);

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
                <Link to="/go-back">
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
                    </div>

                    {/* Βιβλία */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-amber-600 text-lg">No books in your library yet.</p>
                                <a href="/add-book" className="text-amber-700 underline mt-2 inline-block">
                                    Add your first book!
                                </a>
                            </div>
                        ) : (
                            books.map(book => (
                                <div key={book.id} className="bg-white p-4 rounded-lg shadow-md border border-amber-200">
                                    <h3 className="text-lg font-bold text-amber-800 mb-2">{book.title}</h3>
                                    <p className="text-amber-600"><span className="font-semibold">Author:</span> {book.author}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Publisher:</span> {book.publisher}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Pages:</span> {book.pages}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Cost:</span> €{book.cost}</p>
                                    <p className="text-amber-600"><span className="font-semibold">Status:</span>
                                        <span className={`ml-1 ${
                                            book.readingStatus === 'finished' ? 'text-green-800' :
                                                book.readingStatus === 'currently_reading' ? 'text-pink-800' :
                                                    'text-blue-800'
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

                                    {/* 2 ΚΟΥΜΠΙΑ */}
                                    <div className="pt-3 flex gap-6 justify-center mt-4">
                                        <button className="px-3 py-1 border-2  border-green-700 text-green-700 hover:bg-green-50 rounded text-md font-medium">
                                            edit
                                        </button>
                                        <button className="px-3 py-1 border-2 border-red-700 text-red-700 hover:bg-red-50 rounded text-md font-medium">
                                            delete
                                        </button>
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

export default LibraryPage;