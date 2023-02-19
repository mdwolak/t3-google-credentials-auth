import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  defaultValue
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className=''>
      <label htmlFor={name} className="mb-2 block text-sm font-medium leading-none text-gray-700">{label}</label>
      <input
        type={type}
        placeholder=''
        defaultValue={defaultValue}
        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        {...register(name)} />
      {errors[name] && (
        <span className='text-red-500 text-xs pt-1 block'>
          {errors[name]?.message as unknown as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
