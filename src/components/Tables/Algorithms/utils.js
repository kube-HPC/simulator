const getReadmeSource = ({ name, readmeDict }) =>
  readmeDict && readmeDict[name] && readmeDict[name].readme;

export default getReadmeSource;
