import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAlgorithmReadme } from 'actions/readme.action';

const useAlgorithmReadme = algorithmReadme => {
  const readmeDict = useSelector(state => state.algorithmReadme);
  const getReadme = name => readmeDict && readmeDict[name] && readmeDict[name].readme;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAlgorithmReadme(algorithmReadme));
  }, []);

  const source = getReadme(algorithmReadme);
  return {
    fetch,
    source,
  };
};

export default useAlgorithmReadme;
