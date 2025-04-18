export const addPlant = async (plantData: {
    email:string;
    plantName: string;
    species?: string;
    location?: string;
    image?: string;
    acquiredDate: string;
  }) => {
    const response = await fetch('http://localhost:3000/api/plantsList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plantData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add plant');
    }
  
    return await response.json();
  };
  
  export const getPlants = async (userId: string) => {
    const response = await fetch(
      `http://localhost:3000/api/plantList?userId=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  
    if (!response.ok) {
      const error = await response.json();
      console.error("Error fetching plants:", error);  // log the error to console for debugging
      throw new Error(error.message || 'Failed to fetch plants');
    }
  
    const data = await response.json();
    console.log("Fetched plants data:", data);
    return data;
  };
  