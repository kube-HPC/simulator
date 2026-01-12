import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectors } from 'reducers';
import {
  triggerUserGuide,
  changeStep as _changeStep,
} from 'actions/userGuide.action';

import { Tour } from 'antd';
import userGuideSteps from './UserGuideSteps.react';

const UserGuide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOn } = useSelector(selectors.userGuide);

  const [open, setOpen] = useState(false);
  const stepRefs = useRef([]);

  // הפעלת ה‑Tour
  const trigger = useCallback(() => dispatch(triggerUserGuide()), [dispatch]);
  const changeStep = useCallback(
    step => dispatch(_changeStep(step)),
    [dispatch]
  );

  // הפיכת steps עם refs ל‑AntD Tour
  const steps = userGuideSteps.map((step, index) => ({
    title: step.title,
    description: step.content,
    target: () => stepRefs.current[index],
    // אפשר להוסיף פונקציות מתקדמות ב־onNext/onPrev אם צריך
    onNext: () => changeStep(index + 1),
    onPrev: () => changeStep(index - 1),
  }));

  // ניהול פתיחה וסגירה של ה‑Tour לפי isOn
  useEffect(() => {
    if (isOn) {
      setOpen(true);
      navigate('/jobs'); // כמו בקוד המקורי, מתחיל ב'/jobs'
    }
  }, [isOn, navigate]);

  const handleClose = () => {
    setOpen(false);
    trigger(); // סגירת ה‑Tour
  };

  return (
    <>
      {/* הוספת refs לאלמנטים שצריך ל‑Tour */}
      {userGuideSteps.map((step, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          // eslint-disable-next-line no-return-assign
          ref={el => (stepRefs.current[index] = el)}
          style={{ display: 'inline-block' }} // חשוב כדי שה‑Tour יזהה את האלמנט
        >
          {step.render ? step.render() : null}
        </div>
      ))}

      {/* Tour של AntD */}
      <Tour open={open} onClose={handleClose} steps={steps} />
    </>
  );
};

export default React.memo(UserGuide);
