import * as yup from 'yup';
import { Select } from 'antd';
const { Option } = Select;

export const yupMakeReuired = (field) => {
  return yup.string().when([field], {
    is: (field) => !!field,
    then: yup.string().required(),
  });
};

// we can create additional component for Select and pass props, but for this test task it's unnecessary
export const defaultOptions = () => (
  <>
    <Option value="lucy">Lucy</Option>
    <Option value="jack">Jack</Option>
    <Option value="din">Din</Option>
    <Option value="sam">Sam</Option>
  </>
);
