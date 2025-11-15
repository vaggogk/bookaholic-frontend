import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";

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
    notes?: string;
}

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8080/api/books/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch book');
                }

                const bookData = await response.json();
                setBook(bookData);
                setImagePreview(bookData.coverImage || null);
            } catch (error) {
                console.error('Error fetching book:', error);

                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBook();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const bookData = {
           coverImage: imagePreview,
            title: formData.get('title') as string,
            author: formData.get('author') as string,
            publisher: formData.get('publisher') as string,
            pages: parseInt(formData.get('pages') as string),
            cost: parseFloat(formData.get('cost') as string),
            readingStatus: formData.get('readingStatus') as string,
            reviewRating: formData.get('reviewRating') ? parseFloat(formData.get('reviewRating') as string) : null,
            notes: formData.get('notes') as string,
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8080/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
               throw new Error(errorMessage || 'Failed to update book');
            }

            navigate("/home_page");
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Error updating book. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!book) {
        return (
            <div className="flex justify-center items-center min-h-screen flex-col">
                <p className="text-amber-800 text-lg mb-4">Book not found</p>
                <Link to="/home_page" className="text-amber-800 hover:text-amber-900">
                    ← Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Return option */}
            <div className="absolute left-4 top-1/4 -translate-y-1/2">
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

            {/* Header Image */}
            <div className="h-48 relative overflow-hidden shadow-lg flex-shrink-0">
                <img
                    src="/image/pexels-rednguyen-10819256.jpg"
                    alt="Bookshelf Header"
                    className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10"></div>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-amber-50 py-6">
                <form
                    className="max-w-md mx-auto bg-white p-8 border-2 border-amber-800 rounded-xl shadow-lg space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-amber-800 drop-shadow-sm">Edit Your Book</h1>
                        <div className="w-16 h-1  mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Book Cover Upload */}
                    <div className="space-y-2 text-center">
                        <label className="block font-bold text-lg text-amber-800">
                            Book Cover Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            name="coverImage"
                            id="coverImage"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImagePreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="w-full text-amber-900 cursor-pointer border-2 border-amber-700 p-2 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Book Cover Preview"
                                    className="w-40 h-56 object-cover mx-auto rounded-lg shadow-md border border-amber-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Book Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block font-bold text-lg text-amber-800">
                            Book Title
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Enter book title"
                            defaultValue={book.title}
                            required
                        />
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <label htmlFor="author" className="block font-bold text-lg text-amber-800">
                            Author
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                            id='author'
                            name="author"
                            type="text"
                            placeholder="Enter author name"
                            defaultValue={book.author}
                            required
                        />
                    </div>

                    {/* Publisher */}
                    <div className="space-y-2">
                        <label htmlFor="publisher" className="block font-bold text-lg text-amber-800">
                            Publisher
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                            id="publisher"
                            name="publisher"
                            type="text"
                            placeholder="Enter publisher"
                            defaultValue={book.publisher}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Pages */}
                        <div className="space-y-2">
                            <label htmlFor="pages" className="block font-bold text-lg text-amber-800">
                                Total Pages
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-800 transition-colors text-amber-900 placeholder-amber-700"
                                id="pages"
                                name="pages"
                                type="number"
                                min="0"
                                placeholder="0"
                                defaultValue={book.pages}
                                required
                            />
                        </div>

                        {/* Cost */}
                        <div className="space-y-2">
                            <label htmlFor="cost" className="block font-bold text-lg text-amber-800">
                                Cost
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-800 transition-colors text-amber-900 placeholder-amber-700"
                                id="cost"
                                name="cost"
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0.00"
                                defaultValue={book.cost}
                                required
                            />
                        </div>
                    </div>

                    {/* Reading Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="readingStatus" className="block font-bold text-lg text-amber-800">
                                Reading Status
                            </label>
                            <div className="relative">
                                <select
                                    id="readingStatus"
                                    name="readingStatus"
                                    className="w-full p-3 border-2 border-amber-700 rounded-lg appearance-none bg-white focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 font-bold cursor-pointer"
                                    defaultValue={book.readingStatus}
                                >
                                    <option value="to_read">📚 To Read</option>
                                    <option value="currently_reading">📖 Currently Reading</option>
                                    <option value="finished">✅ Finished</option>
                                    <option value="gave_up">❌ Gave up</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-800">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Review */}
                        <div className="space-y-2">
                            <label htmlFor="reviewRating" className="block font-bold text-lg text-amber-800">
                                Review Rating (0-5)
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                                id="reviewRating"
                                name="reviewRating"
                                type="number"
                                min="0.0"
                                max="5"
                                step="0.1"
                                placeholder="0.0 - 5.0"
                                defaultValue={book.reviewRating || ''}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label htmlFor="notes" className="block font-bold text-lg text-amber-800">
                            Notes
                        </label>
                        <textarea
                            className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-800 resize-none"
                            id="notes"
                            name="notes"
                            rows={3}
                            placeholder="Add your notes about the book..."
                            defaultValue={book.notes || ''}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                            type="submit"
                        >
                            📚 Update Book
                        </button>
                    </div>
                </form>
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
    );
};

export default EditPage;