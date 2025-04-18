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
  