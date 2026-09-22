import proxy from "express-http-proxy";

export const proxyWithUser = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log("➡️ Proxying to:", serviceUrl);
      console.log("➡️ User:", srcReq.user);

      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }

      return proxyReqOpts;
    },

    userResDecorator: async (proxyRes, proxyResData, userReq, userRes) => {
      console.log("⬅️ Resume Service status:", proxyRes.statusCode);

      return proxyResData;
    },
  });
};
