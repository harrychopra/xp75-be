export const getAPIVersion = async (req, res) => {
  res.status(200).json({ version: 1.0 });
};

export const methodNotAllowed = async (req, res) => {
  res.status(405).json({ error: 'Method not allowed' });
};
