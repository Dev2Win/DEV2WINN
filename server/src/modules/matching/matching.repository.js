import { callProc } from '../../db/pool.js';

export const matchingRepository = {
  recordFeedback({ actorUserId, candidateId, actorRole, eventType, rating, metadata }) {
    return callProc('sp_matching_feedback_record', [
      actorUserId,
      candidateId,
      actorRole,
      eventType,
      rating ?? null,
      JSON.stringify(metadata ?? {}),
    ]);
  },
};
