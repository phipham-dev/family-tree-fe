import moment from "moment";

const convertTime = (time, type = "DD-MM-YYYY") => {
  return moment(time).format(type);
};

export { convertTime };
