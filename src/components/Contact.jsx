import React, { useState } from "react";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  return (
    <section className="bg-gray-100 py-12" id="contact">
      <div className="grid md:grid-cols-3 grid-cols-1 mx-6 gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-4">
            Feel free to reach out to us via email:
          </p>
          <a
            href="mailto:agrofrost@hub.com"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            agrofrost@hub.com
          </a>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Address</h2>
          <p className="text-gray-600 mb-3">
            Feel free to reach out to this address:
          </p>
          <p>124 Ram Lane Pune, Maharashtra India</p>{" "}
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Enquiry</h2>
          <p className="text-gray-600 mb-3">Suggestion and enquiries:</p>
          <a
            href="mailto:agrofrost@hub.com"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            agrofrosthub@enquiry.com
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
