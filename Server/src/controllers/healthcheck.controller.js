const healthcheck = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Server is healthy ✅"));
};

export { healthcheck };
