import React, {useState} from "react";
import {Link, useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightLeft} from "@fortawesome/free-solid-svg-icons";

interface Toast {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

const AddPage = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const [backendErrors, setBackendErrors] = useState<string[]>([]);
    const [toast, setToast] = useState<Toast>({
        show: false,
        message: '',
        type: 'success'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const title = formData.get('title') as string;
        const author = formData.get('author') as string;
        const publisher = formData.get('publisher') as string;
        const started = formData.get('started') as string;
        const finished = formData.get('finished') as string;
        const pages = formData.get('pages') as string;
        const cost = formData.get('cost') as string;
        const reviewRating = formData.get('reviewRating') as string;

        const today = new Date().toISOString().split('T')[0];
        const errors: string[] = [];

        // Validation για title
        if (!title || title.trim() === '') {
            errors.push('🐞 Book title is required');
        } else if (!/^(?!\s*$).+/.test(title)) {
            errors.push('🐞 Book title cannot be empty or contain only spaces');
        } else if (title.length > 100) {
            errors.push('🐞 Book title cannot exceed 100 characters');
        }

        // Validation για author
        if (!author || author.trim() === '') {
            errors.push('🐞 Author is required');
        } else if (!/^(?!\s*$).+/.test(author)) {
            errors.push('🐞 Author cannot be empty or contain only spaces');
        } else if (author.length > 100) {
            errors.push('🐞 Author cannot exceed 100 characters');
        }

        // Validation για publisher
        if (!publisher || publisher.trim() === '') {
            errors.push('🐞  is required');
        } else if (!/^(?!\s*$).+/.test(publisher)) {
            errors.push('🐞 Publisher cannot be empty or contain only spaces');
        } else if (publisher.length > 100) {
            errors.push('🐞 Publisher cannot exceed 100 characters');
        }

        // Validation για pages
        if (!pages || pages.trim() === '') {
            errors.push('🐞 Pages is required');
        } else {
            const pagesNum = parseInt(pages);
            if (isNaN(pagesNum) || pagesNum < 0) {
                errors.push('🐞 Pages must be a positive number');
            } else if (pagesNum > 10000) {
                errors.push('🐞 Pages cannot exceed 10,000');
            }
        }

        // Validation για cost
        if (!cost || cost.trim() === '') {
            errors.push('🐞 Cost is required');
        } else {
            const costNum = parseFloat(cost);
            if (isNaN(costNum) || costNum < 0) {
                errors.push('🐞 Cost must be a positive number');
            }
        }

        // Validation για started date
        if (started && started > today) {
            errors.push('🐞 Start date cannot be in the future');
        }

        // Validation για finished date
        if (finished && finished > today) {
            errors.push('🐞 Finish date cannot be in the future');
        }

        // Validation started vs finished
        if (started && finished) {
            const startTimestamp = new Date(started).getTime();
            const finishTimestamp = new Date(finished).getTime();

            if (finishTimestamp < startTimestamp) {
                errors.push('🐞 Finish date must be after start date');
            }
        }

        // Validation για review rating
        if (reviewRating && reviewRating.trim() !== '') {
            const rating = parseFloat(reviewRating);
            if (isNaN(rating) || rating < 0 || rating > 5) {
                errors.push('🐞 Rating must be between 0 and 5');
            }
        }

        // Αν υπάρχουν errors, σταμάτησε
        if (errors.length > 0) {
            setBackendErrors(errors);
            return;
        }

        const bookData = {
            coverImage: imagePreview,
            title: title,
            author: author,
            publisher: publisher,
            pages: parseInt(pages),
            cost: parseFloat(cost),
            readingStatus: formData.get('readingStatus') as string,
            reviewRating: reviewRating ? parseFloat(reviewRating) : null,
            started: started || null,
            finished: finished || null,
            notes: formData.get('notes') as string,
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8080/api/books', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                const errorText = await response.text();

                // Duplicate book error handling
                if (errorText.includes('unique_book_title_per_user') || errorText.includes('Duplicate entry')) {
                    setToast({
                        show: true,
                        message: '📚 This book title already exists in your library! Please use a different title.',
                        type: 'error'
                    });
                } else {
                    setToast({
                        show: true,
                        message: `Error: ${errorText || 'Failed to add book'}`,
                        type: 'error'
                    });
                }
                return;
            }

            console.log("Book added successfully! Status:", response.status);

            // Custom success toast
            setToast({
                show: true,
                message: '👏 Book added successfully! Redirecting...',
                type: 'success'
            });

            // Redirect μετά από 2 δευτερόλεπτα
            setTimeout(() => {
                navigate("/home_page");
            }, 2000);

        } catch (error) {
            console.error('Error adding book:', error);

            // Custom error toast
            setToast({
                show: true,
                message: '❌ Error adding book. Please try again.',
                type: 'error'
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 animate-fadeInUp">
                    <div className={`${toast.type === 'success' ? 'bg-amber-500' : 'bg-amber-500'} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center min-w-[300px] border-l-4 ${toast.type === 'success' ?  'border-pink-300' : 'border-pink-300'}`}>
                        <div className={`w-10 h-10 rounded-full ${toast.type === 'success' ? 'bg-amber-500' : 'bg-amber-500'} flex items-center justify-center mr-4`}>
                            <span className="text-xl">
                                {toast.type === 'success' ? '✓' : '✗'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-lg">
                                {toast.type === 'success' ? 'Success!' : 'Error!'}
                            </p>
                            <p className="text-white/90">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => setToast({...toast, show: false})}
                            className="ml-4 text-white/70 hover:text-white text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

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
                    noValidate
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-amber-800 drop-shadow-sm">Add Your Book</h1>
                        <div className="w-16 h-1  mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Book Cover Upload */}
                    <div className="space-y-2 text-center">
                        <label
                            htmlFor="coverImage"
                            className="block font-bold text-lg text-amber-800">
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
                            type="text"
                            name="author"
                            placeholder="Enter author name"
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
                            type="text"
                            name="publisher"
                            placeholder="Enter publisher"
                        />
                    </div>

                    {/* Grid for Pages & Cost */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Pages */}
                        <div className="space-y-2">
                            <label htmlFor="pages" className="block font-bold text-lg text-amber-800">
                                Total Pages
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-800 transition-colors text-amber-900 placeholder-amber-700"
                                id="pages"
                                type="number"
                                name="pages"
                                min="0"
                                max="10000"
                                placeholder="0"
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
                                type="number"
                                name="cost"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
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
                                    defaultValue="to_read"
                                >
                                    <option value="to_read">📋 To Read</option>
                                    <option value="currently_reading">📖 Currently Reading</option>
                                    <option value="finished">🏆 Finished</option>
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
                                type="number"
                                name="reviewRating"
                                min="0.0"
                                max="5"
                                step="0.1"
                                placeholder="0.0 - 5.0"
                            />
                        </div>

                        {/* Started */}
                        <div className="space-y-2">
                            <label htmlFor="started" className="block font-bold text-lg text-amber-800">
                                Started
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                                id="started"
                                type="date"
                                name="started"
                            />
                        </div>

                        {/* Finished */}
                        <div className="space-y-2">
                            <label htmlFor="finished" className="block font-bold text-lg text-amber-800">
                                Finished
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                                id="finished"
                                type="date"
                                name="finished"
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
                        ></textarea>
                    </div>

                    {/* Error Display (Validation Errors) */}
                    {backendErrors.length > 0 && (
                        <div className="mb-6 border-2 border-red-800 bg-red-50 rounded-xl p-4 shadow-md">
                            <div className="flex items-center border-b border-red-700 pb-2 mb-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-red-700 text-xs font-bold">🐞</span>
                                </div>
                                <h4 className="text-red-700 font-bold">Please fix these issues:</h4>
                            </div>
                            <ul className="space-y-2">
                                {backendErrors.map((error, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-red-700 mr-2">➜</span>
                                        <span className="text-red-700 font-bold">{error}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                            type="submit"
                        >
                            📚 Add Book to Collection
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

export default AddPage;