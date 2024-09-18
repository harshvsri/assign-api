import { refreshAccessToken } from "./auth";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(req.body);

  const { accessToken } = await refreshAccessToken(refreshToken);
  res.status(200).json({ accessToken });
};
