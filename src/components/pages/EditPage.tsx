import React, { useState } from "react";

const EditPage = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    return (
        <div className="min-h-screen flex flex-col">
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
                <form className="max-w-md mx-auto bg-white p-8 border-2 border-amber-800 rounded-xl shadow-lg space-y-6">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-amber-800 drop-shadow-sm">Edit Your Book</h1>
                        <div className="w-16 h-1  mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/*  Book Cover Upload */}
                    <div className="space-y-2 text-center">
                        <label className="block font-bold text-lg text-amber-800">
                            Book Cover Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImagePreview(reader.result);
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
                            placeholder="Enter publisher"
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Pages */}
                        <div className="space-y-2">
                            <label htmlFor="page" className="block font-bold text-lg text-amber-800">
                                Total Pages
                            </label>
                            <input
                                className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-800 transition-colors text-amber-900 placeholder-amber-700"
                                id="page"
                                type="number"
                                min="0"
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
                                min="0"
                                step="any"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Reading Status */}
                    <div  className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="readingStatus" className="block font-bold text-lg text-amber-800">
                            Reading Status
                        </label>
                        <div className="relative">
                            <select
                                id="readingStatus"
                                className="w-full p-3 border-2 border-amber-700 rounded-lg appearance-none bg-white focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 font-bold cursor-pointer"
                            >
                                <option value="to_read">📚 To Read</option>
                                <option value="currently_reading">📖 Currently Reading</option>
                                <option value="finished">✅ Finished</option>
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
                        <label htmlFor="review" className="block font-bold text-lg text-amber-800">
                            Review Rating (0-5)
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-700 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-700"
                            id="review"
                            type="number"
                            min="0.0"
                            max="5"
                            step="any"
                            placeholder="0.0 - 5.0"
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
                            rows={3}
                            placeholder="Add your notes about the book..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                            type="submit"
                        >
                            📚 Update
                        </button>
                    </div>
                </form>
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

    );
};

export default EditPage;
