import { useCallback, useEffect } from 'react';
import { pickBy, identity } from 'lodash';
import useSubscribe from './../Routes/SidebarRight/useSubscribe';

const pruneObject = obj => pickBy(obj, identity);

/** @param {[any]} collection */
const normalize = collection =>
  collection.reduce((acc, item, ii) => ({ ...acc, [ii]: item }), {});

// converts arrays to objects on selected fields to match ant requirement
// eslint-disable-next-line no-unused-vars
const parseInitialState = initialState => {
  const nodes =
    initialState?.nodes?.map(item =>
      !item.input
        ? item
        : {
            ...item,
            input: normalize(item.input),
          }
    ) ?? [];
  const state = {
    ...initialState,
    nodes: normalize(nodes),
  };
  return state;
};

const useWizard = (
  form,
  initialState,
  onSubmit,
  setEditorState,
  setValuesState
) => {
  const { setFieldsValue, getFieldsValue } = form;
  const { subscribe } = useSubscribe();

  useEffect(() => {
    setFieldsValue(pruneObject(initialState));
  }, [setFieldsValue, initialState]);

  const getFormattedFormValues = useCallback(() => {
    const formValues = getFieldsValue();

    delete formValues.listKeyValue;
    const nodes = Object.values(formValues?.nodes || {})
      .filter(item => item?.kind)
      .map(item => {
        if (!item?.input) return item;
        return {
          ...item,
          input: Object.values(item?.input),
        };
      });

    return pruneObject({ ...formValues, nodes });
  }, [getFieldsValue]);

  const persistForm = useCallback(() => {
    setEditorState(getFormattedFormValues());
  }, [setEditorState, getFormattedFormValues]);

  useEffect(() => subscribe(persistForm), [subscribe, persistForm]);

  const handleSubmit = useCallback(
    e => {
      e?.preventDefault();
      onSubmit(getFormattedFormValues());
    },
    [getFormattedFormValues, onSubmit]
  );

  const resetKind = useCallback(
    typeKind => {
      const { nodes } = getFieldsValue();
      let isChange = false;
      nodes &&
        nodes.forEach((node, index) => {
          if (
            node.kind == null ||
            node.kind === '' ||
            typeKind?.includes(node?.kind || '')
          ) {
            nodes[index].kind = 'algorithm';
            isChange = true;
          }
        });

      if (isChange) {
        setFieldsValue({ nodes });
      }
    },
    [getFieldsValue, setFieldsValue]
  );

  const setForm = useCallback(() => {
    setTimeout(() => {
      setValuesState(getFormattedFormValues());
    }, 100);
  }, [getFormattedFormValues, setValuesState]);

  return {
    setForm,
    persistForm,
    handleSubmit,
    getFormattedFormValues,

    resetKind,
  };
};

export default useWizard;
