/**
 * Generate consistent creator reputation based on seed
 * This ensures the same creator always has the same reputation score
 */
export function generateCreatorReputation(seed: string) {
  // Use seed to generate consistent random values for the same creator
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const random = Math.abs(hash) / 2147483647;

  return {
    rating: (3.5 + random * 1.5).toFixed(1), // 3.5 to 5.0
    totalReviews: Math.floor(random * 150) + 10, // 10 to 160
    campaignsCreated: Math.floor(random * 20) + 1, // 1 to 21
    totalRaised: (random * 500 + 50).toFixed(1), // 50 to 550 ETH
    responseTime: Math.floor(random * 48) + 1, // 1 to 49 hours
  };
}
