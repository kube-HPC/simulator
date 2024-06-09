import { useState, useCallback } from 'react';
/* eslint-disable import/no-cycle */
import { useReadme } from 'hooks';

const useReadMeFile = (name, type) => {
  const { asyncFetch, post } = useReadme(type);
  const [readme, setReadme] = useState();

  const onApply = useCallback(() => {
    if (name != null) {
      post({ name, readme });
    }
  }, [post, name, readme]);

  const getReadMe = useCallback(async () => {
    if (name) {
      const nextReadme = await asyncFetch({ name });
      setReadme(nextReadme);
    }
  }, [name, asyncFetch]);

  return {
    readme,
    setReadme,
    onApply,
    getReadMe,
  };
};

export default useReadMeFile;
