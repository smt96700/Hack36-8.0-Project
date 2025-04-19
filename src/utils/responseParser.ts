export const extractAdjacencyList = (message: string): Record<string, string[]> => {
    const match = message.match(/```([\s\S]*?)```/);
    if (!match) return {};
  
    const adjacencyText = match[1].trim();
    const lines = adjacencyText.split('\n');
  
    const adjacencyObject: Record<string, string[]> = {};
  
    for (const line of lines) {
      const [plant, companions] = line.split('->').map(part => part.trim());
      if (!plant || !companions) continue;
  
      const companionsList = companions
        .replace(/[\[\]]/g, '') // remove square brackets
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);
  
      adjacencyObject[plant] = companionsList;
    }
  
    return adjacencyObject;
  };

  interface WaterSchedule {
    "Evaporation Risk Score": number;
    "Plant Factor Used": number;
    "Calculated Dry Time (in hrs)": number;
  };
  

  export const parseWaterSchedule = (input: string) => {
    const match = input.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;

  try {
    const jsonContent = match[1].trim();
    return JSON.parse(jsonContent) as WaterSchedule;
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
  }
  
  