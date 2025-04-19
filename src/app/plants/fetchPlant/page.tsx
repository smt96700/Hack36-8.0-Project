'use client';
import { useEffect, useState } from 'react';
import { Plant } from '@/types/Plant';
import { useSession } from 'next-auth/react';

function PlantCard({ plant, onDelete, accessLocation, latitude, longitude }: { plant: Plant; onDelete: (id: string) => void; accessLocation: boolean, latitude: number, longitude: number }) {
  const { status, data: session } = useSession();
  const [handover, setHandover] = useState(false);
  const [takeBack, setTakeBake] = useState(false);
  const [email, setEmail] = useState("");
  // const [latitude, setLatitude] = useState(0);
  // const [longitude, setLongitude] = useState(0);
  // const [accessLocation, setAccessLocation] = useState(false);

  const handleSend = async () => {
    try {
      if (!email) return alert('Please enter an email.');
      if (email === session?.user?.email) return alert('Please do not enter your own email');

      const res = await fetch(`/api/user?email=${email}`);
      if (res.ok) {
        const data = await res.json();
        const request = {
          from: session?.user?.id,
          to: data[0]._id,
          plantId: plant._id,
        };

        const resRequest = await fetch('/api/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (resRequest.ok) {
          alert(`Handover request sent to ${email}`);
          setEmail('');
          setHandover(false);
        }
      }
    } catch (err) {
      console.error('Error sending handover request:', err);
    }
  };

  const deletePlant = async () =>{
    const res = await fetch(`/api/plants?plantId=${plant._id}`,{
      method: "DELETE",
    })
    if(!res.ok)
    {
      console.log("Error in deleting Plant");
    }

    const data = await res.json();
    const plantId=data.deleted._id;
    alert(data.message);
    onDelete(plantId); // Notify parent to remove the deleted plant
  }

  const handleConfirm = async (id : any) => {
    try {
      //set handover to false and delete nominee
      const res = await fetch(`/api/plants?plantId=${id}`, {
        method : 'PUT',
      });
      const data = await res.json();
      console.log("Plant taken Back successfully: ", data)
      alert(`Plant Taken Back Successfully`);
      setTakeBake(false);
    } catch (err) {
      console.log(err)
    }
  }
   
  
  const getSchedule = async() => {
    try {      
      if (!latitude || !longitude) {
        alert('Please allow location access to get the schedule.');
        return;
      }
      const obj= await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const {address:  {city}}= await obj.json();
      const res = await fetch(`/api/sendReminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({plantId: plant._id, city}),
      });
      const data = await res.json();

      console.log("Schedule of water : ", data)
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-white/30 backdrop-blur-lg  pb-2 rounded-2xl shadow-xl border border-white/20 text-white hover:shadow-2xl transition-all duration-300 p-6">
      
      {accessLocation && (
        <>
        <button className='border-2 border-black-50 rounded-2xl bg-white m-4 p-4 text-black cursor-pointer'
        onClick={getSchedule}
      >
        Get Schedule
      </button>
        </>
      )}
       
      <h2 className="text-3xl font-bold mb-4">{plant.name}</h2>
      <p className="text-gray-200 text-lg">📍 {plant.position}</p>
      <p className="text-gray-200 text-lg mb-6">🕒 Age: {plant.age ?? 'N/A'} months</p>
      <button
  onClick={deletePlant}
  className="w-full py-2 rounded-full text-black font-semibold mb-4 bg-gradient-to-r from-green-500 via-green-200 to-green-500 hover:brightness-110 transition-all duration-300"
>
  Delete Plant
</button>
      {plant.handover && plant.createdBy === session?.user?.id && <div>
        <p>Handovered to: {plant?.nominee?.name}({plant?.nominee?.email})</p>
        <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={takeBack}
            onChange={(e) => setTakeBake(e.target.checked)}
          />
          <span>Take Back</span>
        </label>
      </div>

      {takeBack && (
        <div className="flex flex-col space-y-2">

        <button
            onClick={() => handleConfirm(plant._id)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Confirm
        </button>
    </div>
      )}
      </div>}
      {!plant.handover && <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={handover}
            onChange={(e) => setHandover(e.target.checked)}
          />
          <span className="text-gray-200">Handover</span>
        </label>
      </div>}

      {!plant.handover && handover && (
        <div className="flex flex-col space-y-2">
          <input
            type="email"
            placeholder="Enter email to handover"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <button
            onClick={handleSend}
            className="w-full py-2 rounded-full bg-blue-500 text-white font-semibold"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default function PlantList() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [accessLocation, setAccessLocation] = useState(false);
  const { status, data: session } = useSession();
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      if (session?.user?.id) {
        const res = await fetch(`/api/plants?userId=${session?.user?.id}`);
        const data = await res.json();
        setPlants(data);
      }
    };
    if (session?.user?.id) fetchPlants();
  }, [session?.user?.id, status]);

  const handleDelete = (id: string) => {
    setPlants((prev) => prev.filter((plant) => plant._id !== id));
  };

  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude)
      setLongitude(pos.coords.longitude)
      setAccessLocation(true)
      alert('📍 Location fetched successfully!')
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/backgroundImages/mainImg.jpeg')" }}
      ></div>
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10"></div>
      {/* Content */}
      <div className="relative z-20 min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">
          🌱 Your Plant Collection
        </h1>
        {plants.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            No plants added yet. Start growing your collection! 🌿
          </p>
        ) : (
          <>
          {!accessLocation && (
            <button className='border-2 border-black-50 rounded-2xl bg-green-500 m-4 p-4 text-black cursor-pointer'
            onClick={setLocation}
          >
          Get Location
        </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
           {plants
  .filter((plant) => !plant.isCommunity)
  .map((plant) => (
    <PlantCard key={plant._id} plant={plant} onDelete={handleDelete} accessLocation = {accessLocation} latitude= {latitude} longitude= {longitude}/>
))}
          </div>
          </>)}
      </div>
    </div>
  );
}