// This is an example of how to access a session from an API route

import { getServerAuthSession } from "@/src/server/common/getServerAuthSession";
import type { NextApiRequest, NextApiResponse } from "next";

const session = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  res.send(JSON.stringify(session, null, 2));
};
export default session;
