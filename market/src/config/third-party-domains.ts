const thirdPartyDomain: {
  alegra: string;
} = {
  alegra: process.env.ALEGRA_URL || 'http://localhost:3000',
};

export default thirdPartyDomain;
