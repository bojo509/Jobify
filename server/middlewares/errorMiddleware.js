const errorMiddleware = (err, req, res, next) => {
    const defaultError = {
        statusCode: 500,
        status: "Failed",
        message: err,
    }

    if (err?.name === "ValidationError") {
        defaultError.message = Object.values(err, errors)
          .map((el) => el.message)
          .join(", ");
      }
    
      // Duplicate error
      if (err && err.code && err.code === 11000) {
        defaultError.message = `${Object.values(
          err.keyValue
        )} already exists`;
      }
    
      if (res) {
        return res.status(defaultError.statusCode).json({
            status: defaultError.status,
            message: defaultError.message,
        });
      }
}

export default errorMiddleware