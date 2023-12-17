// This is an example of how to access a session from an API route
import type { NextApiRequest, NextApiResponse } from "next";

import { getServerAuthSession } from "~/server/auth";

const session = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession();
  res.send(JSON.stringify(session, null, 2));
};
export default session;
