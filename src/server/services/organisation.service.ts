import { Prisma } from "@prisma/client";

import { type OmitAudit, getCreateProps, getUpdateProps, prisma } from "~/server/db";

export const defaultOrganisationSelect = Prisma.validator<Prisma.OrganisationSelect>()({
  id: true,
  name: true,
  createdById: true,
});

//
// READ

export const findFirst = async (where: Partial<Prisma.OrganisationWhereInput>) => {
  return await prisma.organisation.findFirst({
    where,
    select: defaultOrganisationSelect,
  });
};

export const findUnique = async (where: Prisma.OrganisationWhereUniqueInput) => {
  return await prisma.organisation.findUnique({
    where,
    select: defaultOrganisationSelect,
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await prisma.organisation.findMany({
    select: {
      id: true,
      parentId: true,
      name: true,
      description: true,
      type: true,
      visible: true,
      status: true,
      data: true,
      createdAt: true,
    },
    skip,
    take,
  });
};

//
// WRITE

export const create = async (userId: number, input: OmitAudit<Prisma.OrganisationCreateInput>) => {
  return await prisma.organisation.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultOrganisationSelect,
  });
};

export const update = async (
  userId: number,
  where: Prisma.OrganisationWhereUniqueInput,
  data: OmitAudit<Prisma.OrganisationUpdateInput>,
  select: Prisma.OrganisationSelect = defaultOrganisationSelect
) => {
  return await prisma.organisation.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.OrganisationWhereUniqueInput) => {
  return await prisma.organisation.delete({ where, select: defaultOrganisationSelect });
};
