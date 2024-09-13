import { refreshAccessToken } from "./auth";

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      errors: [{ msg: "Unauthorized" }],
    });
  }

  const { accessToken } = await refreshAccessToken(refreshToken);
  res.status(200).json({ accessToken });
};
