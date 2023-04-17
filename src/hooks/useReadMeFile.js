import { useState, useCallback, useEffect } from 'react';
import { useReadme } from 'hooks';

const useReadMeFile = (name, type) => {
  const { asyncFetch, post } = useReadme(type);
  const [readme, setReadme] = useState();

  const onApply = useCallback(() => {
    if (name != null) {
      post({ name, readme });
    }
  }, [post, name, readme]);

  useEffect(() => {
    if (name != null) {
      const fetchReadme = async () => {
        const nextReadme = await asyncFetch({ name });
        setReadme(nextReadme);
      };
      fetchReadme();
    }
  }, [asyncFetch, name]);
  return {
    readme,
    setReadme,
    onApply,
  };
};

export default useReadMeFile;
