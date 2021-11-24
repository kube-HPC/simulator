import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

const useDevenvs = () => {
  const collection = useSelector(selectors.devenvs.collection.all);
  return { collection };
};

export default useDevenvs;
