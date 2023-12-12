import { type NextApiRequest, type NextApiResponse } from "next";

import { db } from "~/server/db";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await db.example.findMany();
  res.status(200).json(examples);
};

export default examples;
