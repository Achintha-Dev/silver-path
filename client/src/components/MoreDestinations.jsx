import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import DestinationCard from './DestinationCard'

function MoreDestinations() {
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [destination, setDestination] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
    const fetchDestination = async () => {
        try {
        const { data } = await axios.get(`http://localhost:5000/api/destinations/${id}`);
        setDestination(data.data);

        // 👇 Fetch other destinations
        const res = await axios.get(`http://localhost:5000/api/destinations`);
        
        // remove current one
        const filtered = res.data.data.filter(d => d._id !== id);
        setRelated(filtered);

        setLoading(false);
        } catch (error) {
        console.error("Error fetching destination", error);
        setLoading(false);
        }
    };
    fetchDestination();
    }, [id]);

    if (loading) return <div className="p-20 text-white">Loading...</div>;
    if (!destination) return <div className="p-20 text-white">Destination not found.</div>;
  return (
    <div className="ml-3">
    <h2 className="md:text-2xl text-center text-lg font-bold text-white mb-3">Explore More Destinations</h2>

        <div className="carousel carousel-center w-full space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            {related.length > 0 ? (
                related.map((item) => (
                <div key={item._id} className="carousel-item w-80">
                    {/* Clickable Card */}
                    <div
                    onClick={() => navigate(`/destinations/${item._id}`)}
                    className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                    <DestinationCard dest={item} />
                    </div>
                </div>
                ))
            ) : (
                <div className="w-full py-16 text-center text-white/70">
                    <p className="text-lg font-semibold">No other destinations available yet.</p>
                    <p className="mt-3 text-sm text-white/50">Add more destinations in the admin panel or seed additional location data.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default MoreDestinations