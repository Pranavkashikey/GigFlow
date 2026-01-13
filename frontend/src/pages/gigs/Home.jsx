import { useEffect, useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import GigCard from "../../components/gigs/GigCard";

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGigs = async (searchValue = "") => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/gigs?search=${searchValue}`
      );

      const data = await res.json();
      setGigs(data.data || []);
    } catch (err) {
      console.error("❌ Error fetching gigs", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch on first load & when search changes
  useEffect(() => {
    fetchGigs(search);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Bar */}
      <SearchBar
        onSearchChange={setSearch}
        totalResults={gigs.length}
      />

      {loading && <p className="mt-6">Loading...</p>}

      {/* Gig Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
    </div>
  );
};

export default Home;
