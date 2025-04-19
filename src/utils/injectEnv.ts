type EnvReplaceable = string | number | boolean | null | EnvReplaceable[] | { [key: string]: EnvReplaceable };

export const injectEnv= <T extends EnvReplaceable>(obj: T): T =>{
  if (typeof obj === 'string') {
    // Replace ${VAR_NAME} with the corresponding environment variable
    return obj.replace(/\$\{(\w+)\}/g, (_, v) => process.env[v] || '') as T;
  } else if (Array.isArray(obj)) {
    // Recursively process each item in the array
    return obj.map(injectEnv) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    const result: { [key: string]: EnvReplaceable } = {};
    for (const key in obj) {
      result[key] = injectEnv(obj[key]);
    }
    return result as T;
  }

  // Return primitive types (number, boolean, null) unchanged
  return obj;
}
