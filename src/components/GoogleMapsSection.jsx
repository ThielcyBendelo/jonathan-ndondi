import React from "react";

function GoogleMapsSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-black-50 via-black to-blue-50" id="localisation">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-red-500 to-red-300 to-red-200 mb-4 drop-shadow-lg">Localisation professionnelle</h2>
        <p className="text-lg text-gray-400 mb-6">Retrouvez-moi à mon siège, Avenue Kimwenza A/, Kinshasa, DR Congo. Je suis disponibles pour tous vos projets professionnels.</p>
        <div className="rounded-2xl overflow-hidden shadow-xl font-black border border-blue-100">
          <iframe
            title="Google Maps localisation"
            src="https://www.google.com/maps?q=Avenue+Kimwenza+A%2FA25,+Kinshasa,+DR+Congo&output=embed"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="mt-6 text-gray-400 text-base">
          <strong>Adresse :</strong> Avenue Kimwenza A/, Kinshasa, DR Congo<br />
          <strong>Téléphone :</strong> +243 814 176 800<br />
          <strong>Email :</strong> ingebalouiscar@gmail.com
        </div>
      </div>
    </section>
  );
}

export default GoogleMapsSection;
