import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import propertyService, { Property } from "../api/propertyService";

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const isVideoFile = (filename: string) => {
    return (
      filename.toLowerCase().includes(".mp4") ||
      filename.toLowerCase().includes(".webm") ||
      filename.toLowerCase().includes(".ogg") ||
      filename.toLowerCase().includes("video")
    );
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return (
      <div className="text-center text-gray-500">Propriété introuvable.</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        {property.title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Médias</h2>
          <div className="grid grid-cols-2 gap-4">
            {Array.isArray(property.image)
              ? property.image.map((media, index) => {
                  const mediaUrl = media.startsWith("http")
                    ? media
                    : `${process.env.NEXT_PUBLIC_BASE_URL}${media}`;

                  return (
                    <div key={index} className="aspect-video">
                      {isVideoFile(media) ? (
                        <video
                          src={mediaUrl}
                          controls
                          className="w-full h-full object-cover rounded-lg"
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  );
                })
              : property.image && (
                  <div className="aspect-video">
                    {isVideoFile(property.image) ? (
                      <video
                        src={
                          property.image.startsWith("http")
                            ? property.image
                            : `${process.env.NEXT_PUBLIC_BASE_URL}${property.image}`
                        }
                        controls
                        className="w-full h-full object-cover rounded-lg"
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={
                          property.image.startsWith("http")
                            ? property.image
                            : `${process.env.NEXT_PUBLIC_BASE_URL}${property.image}`
                        }
                        alt="Main Image"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}
          </div>

          {/* Plan Images Section */}
          {property.planImage &&
            Array.isArray(property.planImage) &&
            property.planImage.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Plans
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.planImage.map((plan, index) => (
                    <img
                      key={index}
                      src={
                        plan.startsWith("http")
                          ? plan
                          : `${process.env.NEXT_PUBLIC_BASE_URL}0${plan}`
                      }
                      alt={`Plan ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails</h2>
          <div className="space-y-3">
            <p>
              <strong>Emplacement:</strong> {property.location}
            </p>
            <p>
              <strong>Prix:</strong> {property.price}DT
              {property.isRental ? "/mois" : ""}
            </p>
            <p>
              <strong>Type:</strong> {property.type}
            </p>
            <p>
              <strong>Statut:</strong> {property.status}
            </p>
            <p>
              <strong>Superficie:</strong> {property.sqft}m²
            </p>
            {property.beds && (
              <p>
                <strong>Chambres:</strong> {property.beds}
              </p>
            )}
            {property.baths && (
              <p>
                <strong>Salles de bain:</strong> {property.baths}
              </p>
            )}
            {property.description && (
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-gray-600">{property.description}</p>
              </div>
            )}
            {property.tags && property.tags.length > 0 && (
              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {property.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
