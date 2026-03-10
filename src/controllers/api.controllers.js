export const getAPIVersion = async (req, res) => {
  res.status(200).json({ version: 1.0 });
};
