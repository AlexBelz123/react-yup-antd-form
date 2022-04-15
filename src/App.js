import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Select, DatePicker, Button } from 'antd';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import 'antd/dist/antd.css';
import { yupMakeReuired, defaultOptions } from './helpers';

const { setLocale } = yup;

setLocale({
  mixed: {
    notType: 'the ${path} is obligatory',
    required: 'the field ${path} is obligatory',
    oneOf: 'the field ${path} must have one of the following values: ${values}',
  },
});

// default schema
const schema = {
  section_1_Select: yup.string().required(),
  section_1_InputFirst: yup.string().required(),
  section_1_InputSecond: yup.string().required(),
  AntdSelect: yup.string().required(),
  picker1: yup.string().when(['picker2'], {
    is: (picker2) => !picker2,
    then: yup.string().required(),
  }),
  picker2: yup.string().when(['picker1'], {
    is: (picker1) => !picker1,
    then: yup.string().required(),
  }),
};

// extra array for yup resolver
const extraFields = [['picker1', 'picker2']];

// intial state for generic form with [select, input, input]
const initialState = [
  {
    id: uuidv4(),
    selectName: 'section_1_Select',
    input1Name: 'section_1_InputFirst',
    input2Name: 'section_1_InputSecond',
    line: 1,
  },
];

const App = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(yup.object().shape(schema, extraFields)),
    mode: 'all',
  });

  const [items, setItems] = React.useState(initialState);

  const onSubmitHandler = (data) => {
    console.log({ data });
    alert('Success');
    reset();
  };

  const handleAdd = (line) => {
    // create generic names for fields
    const selectName = 'section_' + line + '_Select';
    const input1Name = 'section_' + line + '_InputFirst';
    const input2Name = 'section_' + line + '_InputSecond';

    // add newly created fields to our schema
    schema[input1Name] = yupMakeReuired(input2Name);
    schema[input2Name] = yupMakeReuired(input1Name);

    // push fields to extra array for yup resolver
    // extraFields.push([selectName, input1Name]);
    // extraFields.push([selectName, input2Name]);
    extraFields.push([input1Name, input2Name]);

    // create new item for form
    const newItem = {
      id: uuidv4(),
      selectName,
      input1Name,
      input2Name,
      line: line + 1,
    };

    setItems([...items, newItem]);
  };

  const handleRemove = (id) => {
    setItems((prevItems) => [...prevItems.filter((item) => item.id !== id)]);
  };

  console.log(errors);

  // ------------------------------------------------------
  const renderList = () => {
    return items.map(
      ({ line, id, selectName, input1Name, input2Name }, idx) => (
        <section className="generic" key={id}>
          <Controller
            control={control}
            name={selectName}
            render={({ field }) => (
              <Select
                {...field}
                defaultValue="lucy"
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                style={{ width: 120 }}
              >
                {defaultOptions()}
              </Select>
            )}
          />
          {/* --------------------------------------- */}
          <label>Input 1</label>
          <Controller
            placeholder="AntD Input"
            control={control}
            name={input1Name}
            render={({ field }) => <Input {...field} />}
          />
          {/* --------------------------------------- */}

          <label>Input 2</label>
          <Controller
            placeholder="AntD Input"
            control={control}
            name={input2Name}
            render={({ field }) => <Input {...field} />}
          />

          {idx === items.length - 1 && (
            <Button onClick={() => handleAdd(line + 1)}>Add</Button>
          )}
          {line !== 1 && (
            <Button onClick={() => handleRemove(id)}>Remove</Button>
          )}
        </section>
      )
    );
  };
  // ------------------------------------------------------

  return (
    <form className="container" onSubmit={handleSubmit(onSubmitHandler)}>
      <section>
        <label>Antd Input</label>
        <Controller
          placeholder="AntD Input"
          control={control}
          name="AntdInput"
          render={({ field }) => <Input {...field} />}
        />
      </section>

      <section>
        <Controller
          control={control}
          name="AntdSelect"
          render={({ field }) => (
            <Select
              {...field}
              defaultValue="lucy"
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 120 }}
            >
              {defaultOptions()}
            </Select>
          )}
        />
      </section>

      <section>
        <Controller
          control={control}
          name="picker1"
          render={({ field }) => <DatePicker {...field} />}
        />
        <Controller
          control={control}
          name="picker2"
          render={({ field }) => <DatePicker {...field} />}
        />
      </section>
      {renderList()}
      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
