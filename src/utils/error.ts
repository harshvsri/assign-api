export const handleError = (err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof SyntaxError && "body" in err) {
    // Catch json parsing errors
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  if (err.type === "entity.parse.failed") {
    // Catch body-parser errors
    return res.status(400).json({ error: "Bad request body" });
  }
  return res.status(500).json({ message: "Internal server error" });
};
