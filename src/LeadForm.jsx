import { useState } from "react";

export const LeadForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);

    // Grabbing form data PLUS background data
    const data = {
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      landingPageUrl: window.location.href,       // Captures the full page URL
      submissionDate: new Date().toISOString(),   // Captures the exact date and time
    };

    try {
      await fetch("https://hooks.zapier.com/hooks/catch/25429357/uclzmpn/", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setIsSuccess(true);
      e.target.reset(); 
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-green-800 font-bold text-lg mb-2">Thank You!</h3>
        <p className="text-green-700">Your details have been received. We will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100 w-full hover:shadow-md transition-shadow">
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="e.g. John Doe"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="e.g. +20 100 000 0000"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Submitting..." : "Get Started"}
      </button>
    </form>
  );
};

export default LeadForm;
