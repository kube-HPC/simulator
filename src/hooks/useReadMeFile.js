import { useState, useCallback } from 'react';
/* eslint-disable import/no-cycle */
import { useReadme } from 'hooks';
import { readmeTemplate } from 'config';

const useReadMeFile = (name, type) => {
  const { asyncFetch, post } = useReadme(type);
  const [readme, setReadme] = useState();

  const onApply = useCallback(() => {
    if (name != null) {
      // If content is empty or equals template, save null to database
      // This will clear the README and show template on next open
      if (!readme || readme.trim() === '' || readme === readmeTemplate) {
        post({ name, readme: null });
      } else {
        // Content exists and is different from template - save it
        post({ name, readme });
      }
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
