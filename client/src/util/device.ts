import moment from "moment";

export function calculateLastUpdated(lastUpdatedTime) {
  const lastUpdatedBy = moment(lastUpdatedTime, 'YYYY-MM-DDTHH:mm:ss GMT Z').fromNow();
  return { lastUpdatedBy };
}