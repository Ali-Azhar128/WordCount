import { Model } from 'mongoose';
import { ParaDocument } from '../para.schema.js';

export async function getAdminDocs(
  paraModel: Model<ParaDocument>,
  page: number,
  perPage: number,
) {
  const totalDocs = await paraModel.countDocuments().exec();
  const docs = await paraModel
    .find()
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
  const totalPages = Math.ceil(totalDocs / perPage);
  return { docs, totalPages };
}

export async function getUserDocs(
  paraModel: Model<ParaDocument>,
  page: number,
  perPage: number,
  userId: string,
) {
  const totalDocs = await paraModel
    .countDocuments({
      $or: [{ createdBy: userId }, { isPublic: true }],
    })
    .exec();
  const docs = await paraModel
    .find({ $or: [{ createdBy: userId }, { isPublic: true }] })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
  const anonDocs = await paraModel.find({ type: 'guest' }).exec();
  const allDocs = [...docs, ...anonDocs];
  const totalPages = Math.ceil((totalDocs + anonDocs.length) / perPage);
  if (page === Math.ceil((totalDocs + anonDocs.length) / perPage)) {
    return { docs: allDocs, totalPages: totalPages };
  } else {
    return { docs, totalPages };
  }
}

export async function getGuestDocs(
  paraModel: Model<ParaDocument>,
  page: number,
  perPage: number,
) {
  const totalDocs = await paraModel
    .countDocuments({
      $or: [{ type: 'guest' }, { isPublic: true }],
    })
    .exec();
  const docs = await paraModel
    .find({ $or: [{ type: 'guest' }, { isPublic: true }] })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
  const totalPages = Math.ceil(totalDocs / perPage);
  return { docs, totalPages };
}
